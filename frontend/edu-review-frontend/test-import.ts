import { blogApi } from './src/lib/services/blogApi';

// Test if the API object exists and has the expected methods
console.log('blogApi exists:', !!blogApi);
console.log('blogApi type:', typeof blogApi);
console.log('blogApi methods:', Object.getOwnPropertyNames(blogApi));
console.log('getModerationBlogs exists:', 'getModerationBlogs' in blogApi);
console.log('blogApi.endpoints:', blogApi.endpoints);
