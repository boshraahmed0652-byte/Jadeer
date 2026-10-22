import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoNw-0IBfnlnEWYLy7v4nRbrinVWjsOuk",
  authDomain: "jadeer-84603.firebaseapp.com",
  projectId: "jadeer-84603",
  storageBucket: "jadeer-84603.firebasestorage.app",
  messagingSenderId: "203985205469",
  appId: "1:203985205469:web:6980d3d2f400510aba8334"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase شغال");

/* ========== الإشعارات (Toast) ========== */
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ========== فورم الانضمام ========== */
const joinForm = document.getElementById("joinForm");
const formStatus = document.getElementById("formStatus");

if (joinForm) {
  joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = joinForm.querySelector("button[type='submit']");
    const data = {
      name: joinForm.name.value.trim(),
      email: joinForm.email.value.trim(),
      phone: joinForm.phone.value.trim(),
      university: joinForm.university.value.trim(),
      message: joinForm.message.value.trim(),
      createdAt: serverTimestamp()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "جاري الإرسال...";
    formStatus.textContent = "";

    try {
      await addDoc(collection(db, "registrations"), data);
      formStatus.textContent = "تم التسجيل بنجاح، هنتواصل معاك قريباً 🎉";
      formStatus.style.color = "#4ade80";
      joinForm.reset();
    } catch (error) {
      console.error(error);
      formStatus.textContent = "حصلت مشكلة، حاول مرة تانية.";
      formStatus.style.color = "#f87171";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "إرسال";
    }
  });
}

/* ========== حسابات المستخدمين ========== */
const authBtn = document.getElementById("authBtn");
const authModal = document.getElementById("authModal");
const authClose = document.getElementById("authClose");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authName = document.getElementById("authName");
const authSubmit = document.getElementById("authSubmit");
const authStatus = document.getElementById("authStatus");
const authSwitch = document.getElementById("authSwitch");
const authSwitchText = document.getElementById("authSwitchText");

let isSignup = false;

function setMode(signup) {
  isSignup = signup;
  authTitle.textContent = signup ? "إنشاء حساب" : "تسجيل الدخول";
  authSubmit.textContent = signup ? "إنشاء الحساب" : "دخول";
  authSwitchText.textContent = signup ? "عندك حساب؟" : "معندكش حساب؟";
  authSwitch.textContent = signup ? "تسجيل الدخول" : "إنشاء حساب";
  authName.style.display = signup ? "block" : "none";
  authName.required = signup;
  authStatus.textContent = "";
}

function closeModal() {
  authModal.classList.remove("open");
}

authSwitch.addEventListener("click", () => setMode(!isSignup));
authClose.addEventListener("click", closeModal);
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeModal();
});

authBtn.addEventListener("click", async () => {
  if (auth.currentUser) {
    await signOut(auth);
    showToast("تم تسجيل الخروج، نتمنى نشوفك قريباً 👋");
  } else {
    setMode(false);
    authModal.classList.add("open");
  }
});

function authError(code) {
  const messages = {
    "auth/invalid-email": "البريد الإلكتروني غير صحيح.",
    "auth/email-already-in-use": "الإيميل ده مسجل قبل كده.",
    "auth/weak-password": "كلمة المرور ضعيفة (6 أحرف على الأقل).",
    "auth/invalid-credential": "الإيميل أو كلمة المرور غلط.",
    "auth/too-many-requests": "محاولات كتير، جرب بعد شوية."
  };
  return messages[code] || "حصلت مشكلة، حاول مرة تانية.";
}

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authForm.email.value.trim();
  const password = authForm.password.value;

  authSubmit.disabled = true;
  authStatus.textContent = "";

  try {
    if (isSignup) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: authName.value.trim() });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    authForm.reset();
    closeModal();
    showToast("أهلاً بيك في چدير 🎉");
  } catch (error) {
    console.error(error);
    authStatus.textContent = authError(error.code);
    authStatus.style.color = "#f87171";
  } finally {
    authSubmit.disabled = false;
  }
});

/* ========== تسجيل الدخول بحساب Google ========== */
const googleBtn = document.getElementById("googleBtn");

googleBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    closeModal();
    showToast("أهلاً بيك في چدير 🎉");
  } catch (error) {
    console.error(error);
    if (error.code !== "auth/popup-closed-by-user") {
      authStatus.textContent = "تعذر الدخول بحساب Google، حاول مرة تانية.";
      authStatus.style.color = "#f87171";
    }
  }
});

/* ========== مراقبة حالة الدخول ========== */
onAuthStateChanged(auth, (user) => {
  if (user) {
    const name = user.displayName || user.email.split("@")[0];
    authBtn.textContent = `${name} | خروج`;
  } else {
    authBtn.textContent = "تسجيل الدخول";
  }
});