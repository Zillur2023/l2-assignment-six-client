import { IPost } from "@/type";
import { jsPDF } from "jspdf";

// export const generatePDF = (post: IPost) => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(post.title, 10, 10);
//     doc.setFontSize(12);
//     doc.text(`Category: ${post.category}`, 10, 20);
//     doc.text(`Author: ${post.author.name}`, 10, 30);
//     doc.text(`Content: ${post.content}`, 10, 40);
//     if (post.isPremium) {
//       doc.text("Premium Post", 10, 50);
//     }
//     doc.save(`${post.title}.pdf`);
//   };

export const generatePDF = async(post:IPost) => {
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(16);
    doc.text(post.author.name, 10, 10);
    doc.setFontSize(12);
    doc.text(post.category, 10, 20);
    doc.setFontSize(10);
    doc.text(post.createdAt, 10, 30);
  
    // Content
    doc.setFontSize(14);
    doc.text(post.title, 10, 40);
    doc.setFontSize(12);
    doc.text(post.content, 10, 50);
  
    // Image (if available)
    if (post.image) {
      // Add image using doc.addImage()
    }
  
    // Comments
    doc.setFontSize(12);
    // doc.text(`'Upvotes:': ${post.upvotes}`, 10, 80);
    // doc.text(`'Downvotes:': ${post.downvotes.length}`, 10, 80);
    // doc.text(`'Comments:': ${post.comments.length}`, 10, 80);
    // post.comments.forEach((comment, index) => {
    //   doc.setFontSize(10);
    // //   doc.text(`${comment?.author.name}: ${comment.content}`, 10, 90 + 15 * index);
    //   doc.text(`${comment?.author.name}: ${comment.content}`, 10, 90 + 15 * index);
    // });

  
    // Footer
    // Add buttons and comment box using doc.rect() and doc.text()
  
    doc.save(`${post.title}.pdf`);
  };
  