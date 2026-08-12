This folder is where your real images should go.

The live site currently uses CSS-gradient + icon placeholders for:
- Project screenshots      (#projects section, .project-img)
- Certificate thumbnails   (#certificates section, if you want to add scans)
- Gallery photos           (#gallery section, .gallery-item)

To swap in real images:
1. Drop your image files in this /images folder
   e.g. images/coffee-app.jpg, images/gallery-1.jpg
2. In index.html, replace the relevant placeholder block, for example:

   <div class="project-img" style="--c1:#2563EB;--c2:#06B6D4;">
     <i class="fa-solid fa-mug-hot"></i>
   </div>

   becomes:

   <div class="project-img">
     <img src="images/coffee-app.jpg" alt="Coffee Shop Mobile App UI screens">
   </div>

3. Add this small CSS rule to css/style.css so images fill the card nicely:

   .project-img img,
   .gallery-item img { width: 100%; height: 100%; object-fit: cover; }

Recommended sizes: project images ~800x500px, gallery images ~800x600px, all as .jpg or .webp for fast loading.
