<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Đăng Nhập - VeriGlow Traceability</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%);
            min-height: 100vh;
        }
        .glass { background: rgba(255, 255, 255, 0.93); backdrop-filter: blur(20px); }
        .tab-btn.active {
            background: linear-gradient(90deg, #0ea5e9, #10b981);
            color: white;
            box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.4);
        }
        .submit-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -8px rgba(16, 185, 129, 0.4); }
    </style>
</head>
<body class="flex items-center justify-center p-4">

    <div id="intro-screen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/60 transition-all duration-700">
        <div class="text-center z-10 px-6">
            <img src="2.png" alt="VeriGlow Logo" class="mx-auto w-36 h-36 rounded-full object-cover shadow-2xl border-8 border-white/40 mb-8">
            <h1 class="text-5xl font-bold text-white drop-shadow-xl">VeriGlow</h1>
            <p class="text-white/90 text-xl mt-3 font-light">Blockchain Traceability</p>
            <button onclick="enterDashboard()" class="mt-12 px-14 py-6 bg-white text-slate-900 rounded-3xl font-semibold text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4 mx-auto">
                <span>Tiếp tục đăng nhập</span>
                <i class="fa-solid fa-arrow-right text-emerald-500"></i>
            </button>
        </div>
    </div>

    <div id="main-content" class="hidden w-full max-w-md mx-auto">
        <div class="glass rounded-3xl shadow-2xl p-8 border border-white/60">
            <div class="flex items-center justify-center gap-3 mb-8">
                <img src="2.png" alt="Logo" class="w-12 h-12 rounded-2xl object-cover">
                <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">VeriGlow</h1>
            </div>

            <div class="flex bg-slate-100 rounded-2xl p-1 mb-8">
                <button id="loginTab" onclick="switchTab('login')" class="tab-btn active flex-1 py-4 rounded-xl font-semibold text-sm">Đăng Nhập</button>
                <button id="registerTab" onclick="switchTab('register')" class="tab-btn flex-1 py-4 rounded-xl font-semibold text-sm">Tạo Tài Khoản</button>
            </div>

            <form id="loginForm" class="space-y-5">
                <input type="email" id="loginEmail" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm" placeholder="Email" required>
                <input type="password" id="loginPassword" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm" placeholder="Mật khẩu" required>
                <button type="submit" class="submit-btn w-full py-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg">Đăng Nhập</button>
            </form>

            <form id="registerForm" class="hidden space-y-5">
                <input type="text" id="regUsername" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm" placeholder="Tên người dùng" required>
                <input type="email" id="regEmail" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm" placeholder="Email" required>
                <input type="password" id="regPassword" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm" placeholder="Mật khẩu (6+ ký tự)" required>
                <select id="regRole" class="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none text-sm bg-white" required>
                    <option value="">-- Chọn vai trò --</option>
                    <option value="manufacturer">Nhà sản xuất</option>
                    <option value="distributor">Nhà phân phối</option>
                    <option value="consumer">Người tiêu dùng</option>
                </select>
                <button type="submit" class="submit-btn w-full py-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg">Đăng Ký</button>
            </form>

            <div id="g_id_signin" class="mt-8 flex justify-center"></div>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

        // CẤU HÌNH CHÍNH XÁC TỪ PROJECT VERIGLOW
        const firebaseConfig = {
            apiKey: "AIzaSyDAQH-F90Hv_f1uMOENv7hCm_bGU9f0aGs",
            authDomain: "veriglow.firebaseapp.com",
            projectId: "veriglow",
            storageBucket: "veriglow.firebasestorage.app",
            messagingSenderId: "400350869290",
            appId: "1:400350869290:web:a4bff84794214a1dcb5053"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // UI Functions
        window.enterDashboard = () => {
            const intro = document.getElementById('intro-screen');
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.style.display = 'none';
                document.getElementById('main-content').classList.remove('hidden');
            }, 700);
        };

        window.switchTab = (type) => {
            document.getElementById("loginForm").classList.toggle("hidden", type === 'register');
            document.getElementById("registerForm").classList.toggle("hidden", type === 'login');
            document.getElementById("loginTab").classList.toggle("active", type === 'login');
            document.getElementById("registerTab").classList.toggle("active", type === 'register');
        };

        // Register Logic
        document.getElementById("registerForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;
            const username = document.getElementById("regUsername").value.trim();
            const role = document.getElementById("regRole").value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email,
                    role: role,
                    createdAt: new Date().toISOString()
                });

                alert("Đăng ký thành công! Hãy đăng nhập.");
                window.switchTab('login');
            } catch (error) {
                alert("Lỗi đăng ký: " + error.message);
            }
        });

        // Login Logic
        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Lưu cả 2 nơi để đảm bảo tương thích các trang cũ/mới
                    sessionStorage.setItem("currentUser", JSON.stringify({ ...userData, uid: user.uid }));
                    localStorage.setItem("loggedInUserId", user.uid);
                    
                    alert("Đăng nhập thành công!");
                    const target = userData.role === "manufacturer" ? "manufacturer.html" : 
                                 userData.role === "distributor" ? "distributor.html" : "consumer.html";
                    window.location.href = target;
                }
            } catch (error) {
                alert("Sai email hoặc mật khẩu. Vui lòng thử lại.");
            }
        });
    </script>
</body>
</html>
