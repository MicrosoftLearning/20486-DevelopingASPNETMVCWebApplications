using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.IO;

namespace PhotoSharingApplication.Models
{
    public class PhotoSharingInitializer : DropCreateDatabaseAlways<PhotoSharingContext>
    {
        //This gets a byte array for a file at the path specified
        //The path is relative to the route of the web site
        //It is used to seed images
        private byte[] getFileBytes(string path)
        {
            FileStream fileOnDisk = new FileStream(HttpRuntime.AppDomainAppPath + path, FileMode.Open);
            byte[] fileBytes;
            using (BinaryReader br = new BinaryReader(fileOnDisk))
            {
                fileBytes = br.ReadBytes((int)fileOnDisk.Length);
            }
            return fileBytes;
        }

        protected override void Seed(PhotoSharingContext context)
        {
            base.Seed(context);

            //Create some photos
            var photos = new List<Photo>
            {
                new Photo
                    {
                        Title = "Test Photo",
                        Description = "Your Description",
                        UserName = "NaokiSato",
                        PhotoFile = getFileBytes ("\\Images\\flower.jpg"),
                        ImageMimeType = "image/jpeg",
                        CreatedDate = DateTime.Today
                    }
            };
            photos.ForEach(s => context.Photos.Add(s));
            context.SaveChanges();

            var comments = new List<Comment>
            {
                new Comment
                {
                PhotoId = 1,
                UserName = "NaokiSato",
                Subject = "Test Comment",
                Body = "This comment " + "should appear in " + "photo 1"
                }
            };
            comments.ForEach(s => context.Comments.Add(s));
            context.SaveChanges();
        }
    }
}