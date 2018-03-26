using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace PhotoSharingApplication.Models
{
    public class PhotoSharingContext : DbContext, IPhotoSharingContext
    {
        public PhotoSharingContext() : base()
        {
            this.Database.CommandTimeout = 180;
        }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        IQueryable<Photo> IPhotoSharingContext.Photos
        {
            get { return Photos; }
        }

        IQueryable<Comment> IPhotoSharingContext.Comments
        {
            get { return Comments; }
        }

        int IPhotoSharingContext.SaveChanges()
        {
            return SaveChanges();
        }

        T IPhotoSharingContext.Add<T>(T entity)
        {
            return Set<T>().Add(entity);
        }

        Photo IPhotoSharingContext.FindPhotoById(int Id)
        {
            return Set<Photo>().Find(Id);
        }

        Comment IPhotoSharingContext.FindCommentById(int Id)
        {
            return Set<Comment>().Find(Id);
        }

        T IPhotoSharingContext.Delete<T>(T entity)
        {
            return Set<T>().Remove(entity);
        }
    }
}