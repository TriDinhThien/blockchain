<script>
// Tab Switch
function switchTab(type) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    if (type === "login") {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        loginTab.classList.remove("active");
        registerTab.classList.add("active");
    }
}

// ====================== ĐĂNG KÝ ======================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    if (!role) return alert("Vui lòng chọn vai trò!");
    if (password.length < 6) return alert("Mật khẩu phải có ít nhất 6 ký tự!");

    const btn = e.target.querySelector("button");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo tài khoản...`;

    try {
        const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;

        await setDoc(doc(window.firebaseDB, "users", user.uid), {
            username: username,
            email: email,
            role: role,
            createdAt: new Date().toISOString()
        });

        alert("✅ Tạo tài khoản thành công! Đang chuyển hướng...");
        
        // Tự động đăng nhập ngay sau khi tạo (trơn tru hơn)
        const loginCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        const loggedUser = loginCredential.user;
        
        const userDoc = await getDoc(doc(window.firebaseDB, "users", loggedUser.uid));
        const userRole = userDoc.data().role;

        saveSession({ email: loggedUser.email, role: userRole, uid: loggedUser.uid });
        redirectByRole(userRole);

    } catch (error) {
        console.error(error);
        if (error.code === "auth/email-already-in-use") {
            alert("❌ Email này đã được sử dụng. Vui lòng dùng email khác.");
        } else {
            alert("❌ Lỗi: " + error.message);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
});

// ====================== ĐĂNG NHẬP ======================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const btn = e.target.querySelector("button");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...`;

    try {
        const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(window.firebaseDB, "users", user.uid));
        if (!userDoc.exists()) throw new Error("Không tìm thấy thông tin tài khoản!");

        const role = userDoc.data().role;

        saveSession({ email: user.email, role: role, uid: user.uid });
        redirectByRole(role);

    } catch (error) {
        console.error(error);
        if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
            alert("❌ Email hoặc mật khẩu không đúng.");
        } else {
            alert("❌ Đăng nhập thất bại: " + error.message);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
});

function saveSession(user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function redirectByRole(role) {
    if (role === "manufacturer") window.location.href = "manufacturer.html";
    else if (role === "distributor") window.location.href = "distributor.html";
    else window.location.href = "consumer.html";
}

// Google Sign In (chỉ placeholder)
window.onload = function() {
    // Thay YOUR_GOOGLE_CLIENT_ID bằng client ID thật của bạn
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
    );
};

function handleCredentialResponse(response) {
    // Sau này bạn sẽ xử lý Firebase Google Auth ở đây
    alert("Google sign-in chưa được triển khai đầy đủ. Đang dùng mode demo.");
    const user = { email: "google_user@example.com", role: "consumer", uid: "demo-uid" };
    saveSession(user);
    redirectByRole("consumer");
}

// Enter Dashboard
function enterDashboard() {
    const intro = document.getElementById('intro-screen');
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden');
    }, 700);
}
</script>
