function login() {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorBox = document.getElementById("error");
            // 纯前端示例
            if (username === "people" && password === "12345") {
                alert("登录成功！");
                errorBox.style.display = "none";
            } else {
                errorBox.style.display = "block";
            }
        }
