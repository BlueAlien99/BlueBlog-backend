const mongoose = require('mongoose');

const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');

const DOMPurify = createDOMPurify(new JSDOM('').window);


const blogSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  slug: String,
  author: String,
  title: String,
  subtitle: String,
  content: String,
  markdown: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});


blogSchema.pre('validate', function(next){

  if(this.isNew){
    this.id = this._id.toString().slice(18);
  }

  this.slug = slugify(this.title, {
    lower: true,
    strict: true
  });

  const dirtyMD = marked(this.content);
  this.markdown = DOMPurify.sanitize(dirtyMD);

  next();
});


module.exports = mongoose.model('Blog', blogSchema);