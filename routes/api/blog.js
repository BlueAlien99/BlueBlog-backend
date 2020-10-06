const express = require('express');
const router = express.Router();

const {validateBlog} = require('../../utils/validation');
const {verifyToken} = require('../../middleware/tokenHandler');

const Blog = require('../../models/Blog');


router.get('/get/:id', async (req, res) => {

  const blog = await Blog.findOne({ id: req.params.id });

  if(!blog){
    return res.sendStatus(404);
  }

  res.send(JSON.stringify(blog));
});


router.post('/new', verifyToken, async (req, res) => {

  if(!req.body.blog){
    return res.status(400).send('No data provided');
  }

  const {error} = validateBlog(req.body.blog);

  if(error){
    return res.status(400).send(error);
  }

  const {title, subtitle, content} = req.body.blog;
  const author = req.body.authTokenDecoded.username;

  const blog = new Blog({
    author,
    title,
    subtitle,
    content
  });

  try{
    await blog.save();
  } catch(err){
    return res.status(400).send(err);
  }

  res.send(JSON.stringify(blog));
});


module.exports = router;