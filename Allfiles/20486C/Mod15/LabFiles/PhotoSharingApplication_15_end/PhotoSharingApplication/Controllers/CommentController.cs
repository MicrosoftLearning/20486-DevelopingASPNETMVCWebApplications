using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PhotoSharingApplication.Models;

namespace PhotoSharingApplication.Controllers
{
    public class CommentController : Controller
    {
        private IPhotoSharingContext context;

        //Constructors
        public CommentController()
        {
            context = new PhotoSharingContext();
        }

        public CommentController(IPhotoSharingContext Context)
        {
            context = Context;
        }

        [ChildActionOnly]
        public PartialViewResult _CommentsForPhoto(int PhotoId)
        {
            var comments = from c in context.Comments
                           where c.PhotoId == PhotoId
                           select c;

            ViewBag.PhotoId = PhotoId;
            return PartialView("_CommentsForPhoto", comments.ToList());
        }

        //
        // GET: /Comment/Delete/5
        [Authorize]
        public ActionResult Delete(int id = 0)
        {
            Comment comment = context.FindCommentById(id);
            ViewBag.PhotoId = comment.PhotoId;
            if (comment == null)
            {
                return HttpNotFound();
            }
            return View(comment);
        }

        //
        // POST: /Comment/Delete/5
        [Authorize]
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Comment comment = context.FindCommentById(id);
            context.Delete<Comment>(comment);
            context.SaveChanges();
            return RedirectToAction("Display", "Photo", new { id = comment.PhotoId });
        }

        [Authorize]
        public PartialViewResult _Create(int PhotoId)
        {
            Comment newComment = new Comment();
            newComment.PhotoId = PhotoId;

            ViewBag.PhotoId = PhotoId;

            return PartialView("_CreateAComment");
        }

        [HttpPost]
        public PartialViewResult _CommentsForPhoto(Comment comment, int PhotoId)
        {
            context.Add<Comment>(comment);
            context.SaveChanges();

            var comments = from c in context.Comments
                           where c.PhotoId == PhotoId
                           select c;

            ViewBag.PhotoId = PhotoId;

            return PartialView("_CommentsForPhoto", comments.ToList());
        }
    }
}
