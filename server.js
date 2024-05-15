const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

// Sample data for blog posts
let posts = [
    { id: 1, title: 'Whispers of the Forest', content: "In the heart of the forest, a gentle stream whispered secrets to the ancient trees. Sunlight filtered through the leaves, painting patterns on the forest floor. Birds sang melodious tunes, creating a symphony of nature. A deer cautiously approached the stream, quenching its thirst. Nearby, a squirrel busily collected nuts for the coming winter. The forest was alive with activity, yet peaceful in its serenity. Far above, a hawk soared majestically, scanning the land below. A rustle in the bushes hinted at hidden creatures going about their day. Time seemed to stand still in this tranquil oasis. As evening approached, the forest prepared for the night's symphony of sounds.", image:[] },
    { id: 2, title: 'A Journey Through Time: Exploring Ancient Ruins', content: 'Deep in the heart of a dense jungle, the remnants of an ancient civilization lay hidden, waiting to be discovered. As archaeologists unearthed the ruins, a story spanning centuries began to emerge. Intricately carved stones revealed tales of kings and queens, wars and peace, triumphs and tragedies.The grandeur of the temples and palaces hinted at a once-thriving society that had long been forgotten. Each step through the ruins was like a step back in time, as if the ancient spirits were guiding the way. Among the rubble, artifacts were found - pottery, tools, and jewelry - each piece a puzzle in the larger story of this lost civilization. The archaeologists worked tirelessly, piecing together the fragments of the past to reveal a clearer picture of life in ancient times.As the sun set behind the jungle canopy, casting long shadows over the ruins, the sense of awe and wonder was palpable. These ancient ruins were not just stones; they were a window into a world long gone, a testament to the ingenuity and creativity of humanity.As the expedition came to an end, the archaeologists left with a newfound appreciation for history and a deeper understanding of the past. The journey through time had been a remarkable one, leaving an indelible mark on all who had the privilege to explore these ancient ruins.', image: [] }
];

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route handler for individual blog posts
app.get('/blog/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
        return res.status(400).send('Invalid post ID');
    }
    const post = posts.find(post => post.id === postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('post', { post });
});

// Route handler for the blog page
app.get('/blog', (req, res) => {
    res.render('index', { posts });
});

// Redirect root URL to the blog page
app.get('/', (req, res) => {
    res.redirect('/blog');
});

// Route handler for the editor page
app.get('/editor', (req, res) => {
    res.render('editor');
});

// Route handler for publishing a new blog post
app.post('/publish', upload.array('image', 5), (req, res) => {
    // Process the form data and save the new blog post
    const { title, content } = req.body;
    const images = req.files.map(file => file.filename);
    
    // Add the new post to the list of posts
    const newPost = { id: posts.length + 1, title, content, images };
    posts.push(newPost);

    // Redirect to the new post
    res.redirect(`/blog/${newPost.id}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
