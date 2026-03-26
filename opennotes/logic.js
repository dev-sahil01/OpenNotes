const firebaseConfig = { /* PASTE YOUR FIREBASE CONFIG HERE */ };
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// 1. AUTHENTICATION LOGIC
function toggleAuth() {
    document.getElementById('register-table').classList.toggle('hidden');
    document.getElementById('login-table').classList.toggle('hidden');
}

async function register() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const user = document.getElementById('reg-username').value;
    const phone = document.getElementById('reg-phone').value;

    try {
        const res = await auth.createUserWithEmailAndPassword(email, pass);
        // Save extra info to Firestore
        await db.collection("users").doc(res.user.uid).set({
            name: name,
            username: "@" + user,
            phone: phone,
            email: email
        });
        alert("Account Created!");
    } catch (e) { alert(e.message); }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try {
        await auth.signInWithEmailAndPassword(email, pass);
    } catch (e) { alert(e.message); }
}

// 2. SESSION HANDLING
auth.onAuthStateChanged(async (user) => {
    if (user) {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-site').classList.remove('hidden');
        
        const userDoc = await db.collection("users").doc(user.uid).get();
        document.getElementById('display-username').innerText = userDoc.data().username;
        loadFeed();
    } else {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-site').classList.add('hidden');
    }
});

// 3. STORAGE & DB POSTING
async function uploadPost() {
    const text = document.getElementById('postText').value;
    const title = document.getElementById('postTitle').value;
    const files = document.getElementById('postImages').files;
    const user = auth.currentUser;

    if (text.split(' ').length > 250) return alert("Max 250 words!"); [cite: 2]
    if (files.length > 2) return alert("Max 2 images!"); [cite: 6]

    let urls = [];
    for (let f of files) {
        const ref = storage.ref(`posts/${Date.now()}_${f.name}`);
        await ref.put(f);
        urls.push(await ref.getDownloadURL());
    }

    const userData = (await db.collection("users").doc(user.uid).get()).data();

    await db.collection("posts").add({
        username: userData.username,
        title: title,
        content: text,
        images: urls,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    location.reload();
}

// 4. LOAD FEED (Document Style)
async function loadFeed() {
    const snapshot = await db.collection("posts").orderBy("timestamp", "desc").get();
    let html = '<table border="1">';
    snapshot.forEach(doc => {
        const data = doc.data();
        html += `
            <tr>
                <td width="50%">
                    ${data.username}<br>
                    <div class="scroll-bar">Scroll bar</div> [cite: 33]
                    <p><strong>${data.title}</strong></p> [cite: 35]
                    <p>${data.images.length > 0 ? '(click to see full image )' : 'No images'}</p> [cite: 7]
                    <p>${data.content}</p> [cite: 13]
                    <a href="#">Click this to learn</a> [cite: 16]
                </td>
            </tr>`;
    });
    html += '</table>';
    document.getElementById('feed-container').innerHTML = html;
}//