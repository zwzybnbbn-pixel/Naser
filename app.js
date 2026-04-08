import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, doc, setDoc, query, where, serverTimestamp, updateDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC06KKxkehT1uPBT9k-r-d6MmB4RUuVy9Y",
    authDomain: "mosque-system.firebaseapp.com",
    projectId: "mosque-system",
    storageBucket: "mosque-system.firebasestorage.app",
    messagingSenderId: "905816133159",
    appId: "1:905816133159:web:3b95d858815f91780e0802"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- 1. إدارة الحلقات ---
window.loadHalaqatList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "halaqat"));
        const selectAdd = document.getElementById('halaqaSelect'); 
        const selectFilter = document.getElementById('halaqaFilter'); 

        if (selectAdd && selectFilter) {
            const optionsHeader = '<option value="">اختر الحلقة...</option>';
            selectAdd.innerHTML = optionsHeader;
            selectFilter.innerHTML = optionsHeader;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const option = `<option value="${doc.id}">${data.name} - (الشيخ: ${data.teacherName})</option>`;
                selectAdd.innerHTML += option;
                selectFilter.innerHTML += option;
            });
        }
    } catch (e) { console.error("خطأ في جلب الحلقات:", e); }
};

// --- 2. تصفية الطلاب ---
window.filterStudentsByHalaqa = async () => {
    const selectedHalaqa = document.getElementById('halaqaFilter').value;
    const studentSelect = document.getElementById('studentIdSelect');
    if (!selectedHalaqa) return;
    studentSelect.innerHTML = '<option>جاري التحميل...</option>';
    try {
        const q = query(collection(db, "students"), where("halaqaId", "==", selectedHalaqa));
        const querySnapshot = await getDocs(q);
        studentSelect.innerHTML = '<option value="">اختر الطالب...</option>';
        querySnapshot.forEach((doc) => {
            studentSelect.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
        });
    } catch (e) { alert("خطأ في تصفية الطلاب: " + e.message); }
};

// --- 3. حفظ التسميع ---
window.saveDailyRecitation = async () => {
    const studentId = document.getElementById('studentIdSelect').value;
    const surahName = document.getElementById('currentSurah').value;
    const fromAya = document.getElementById('fromAya').value;
    const toAya = document.getElementById('toAya').value;
    const tomorrowReq = document.getElementById('tomorrowReq').value;
    const notes = document.getElementById('teacherNotes').value;

    const evaluations = [];
    document.querySelectorAll('.eval-check:checked').forEach((check) => {
        evaluations.push(check.value);
    });

    if (!studentId || !surahName) return alert("يرجى إكمال البيانات الأساسية");

    try {
        await addDoc(collection(db, "daily_recitations"), {
            studentId, surahName, range: `من ${fromAya} إلى ${toAya}`,
            evaluation: evaluations, tomorrowRequirement: tomorrowReq,
            notes, date: new Date().toISOString().split('T')[0],
            timestamp: serverTimestamp()
        });
        await updateDoc(doc(db, "students", studentId), { totalPoints: increment(10) });
        alert("تم رصد التسميع بنجاح ✨");
        resetRecitationForm();
    } catch (e) { alert("خطأ: " + e.message); }
};

// --- 4. إضافة طالب (دعم الإخوة) ---
window.addNewStudent = async () => {
    const parentEmail = document.getElementById('parentEmail').value;
    const parentPass = document.getElementById('parentPass').value;
    const studentName = document.getElementById('studentName').value;
    const halaqaId = document.getElementById('halaqaSelect').value;

    try {
        let parentUid;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, parentEmail, parentPass);
            parentUid = userCredential.user.uid;
            await setDoc(doc(db, "parents", parentUid), { email: parentEmail, createdAt: serverTimestamp() });
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                const q = query(collection(db, "parents"), where("email", "==", parentEmail));
                const snap = await getDocs(q);
                parentUid = snap.docs[0].id;
            } else { throw error; }
        }
        await addDoc(collection(db, "students"), {
            name: studentName, parentId: parentUid, halaqaId,
            totalPoints: 0, joinDate: serverTimestamp(), isActive: true
        });
        alert(`تمت إضافة ${studentName} بنجاح ✅`);
        document.getElementById('studentName').value = "";
    } catch (e) { alert("خطأ: " + e.message); }
};

// --- 5. الفعاليات (معرف ثابت: next_event) ---
window.updateEvent = async () => {
    const title = document.getElementById('eventTitle').value;
    const locName = document.getElementById('eventLocation').value;
    const date = document.getElementById('eventDate').value;

    try {
        await setDoc(doc(db, "settings", "next_event"), {
            title, location: locName, date, lastUpdated: serverTimestamp()
        });
        alert("تم تحديث الفعالية القادمة بنجاح ✅");
    } catch (e) { alert("خطأ: " + e.message); }
};

// --- 6. خطبة الجمعة (معرف ثابت: next_khutba) ---
window.updateKhutba = async () => {
    const title = document.getElementById('khutbaTitle').value;
    const imam = document.getElementById('khutbaImam').value;

    try {
        await setDoc(doc(db, "settings", "next_khutba"), {
            title, imam, lastUpdated: serverTimestamp()
        });
        alert("تم تحديث بيانات الخطبة بنجاح ✅");
    } catch (e) { alert("خطأ: " + e.message); }
};

// وظائف التنقل
window.showSection = (sectionId) => {
    document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    if(['students', 'halaqat'].includes(sectionId)) window.loadHalaqatList(); 
};

function resetRecitationForm() {
    document.getElementById('currentSurah').value = "";
    document.querySelectorAll('.eval-check').forEach(c => c.checked = false);
}
// --- 7. تحديث أوقات الصلاة ---
window.updatePrayerTimes = async () => {
    const times = {
        fajr: document.getElementById('fajr').value,
        dhuhr: document.getElementById('dhuhr').value,
        asr: document.getElementById('asr').value,
        maghrib: document.getElementById('maghrib').value,
        isha: document.getElementById('isha').value,
        lastUpdated: serverTimestamp()
    };

    try {
        await setDoc(doc(db, "prayer_times", "today"), times);
        alert("تم تحديث أوقات الصلاة بنجاح ✅");
    } catch (e) { alert("خطأ: " + e.message); }
};

// --- 8. إضافة محاضرة ---
window.addLecture = async () => {
    const title = document.getElementById('lectureTitle').value;
    const speaker = document.getElementById('speakerName').value;
    const time = document.getElementById('lectureTime').value;

    try {
        await addDoc(collection(db, "lectures"), {
            title, speaker, time, createdAt: serverTimestamp()
        });
        alert("تم نشر المحاضرة بنجاح ✅");
    } catch (e) { alert("خطأ: " + e.message); }
};
// --- 9. إضافة حلقة جديدة ---
window.addNewHalaqa = async () => {
    const name = document.getElementById('newHalaqaName').value;
    const teacherName = document.getElementById('newTeacherName').value;

    if (!name || !teacherName) return alert("يرجى إدخال اسم الحلقة واسم المدرس");

    try {
        await addDoc(collection(db, "halaqat"), {
            name: name,
            teacherName: teacherName,
            createdAt: serverTimestamp()
        });
        alert("تمت إضافة الحلقة بنجاح ✅");
        
        // إفراغ الحقول بعد الحفظ
        document.getElementById('newHalaqaName').value = "";
        document.getElementById('newTeacherName').value = "";
        
        // تحديث القوائم المنسدلة في الأقسام الأخرى فوراً
        window.loadHalaqatList();
    } catch (e) { 
        alert("خطأ أثناء إضافة الحلقة: " + e.message); 
    }
};