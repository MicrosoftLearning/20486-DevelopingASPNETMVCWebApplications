using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;

namespace PhotoSharingApplication.Models
{
    public class PhotoSharingInitializer : DropCreateDatabaseAlways<PhotoSharingContext>
    {
        //This method puts sample data into the database
        protected override void Seed(PhotoSharingContext context)
        {
            base.Seed(context);

            //Create some photos
            var photos = new List<Photo>
            {
                new Photo {
                    Title = "Sample Photo 1",
                    Description = "This is the first sample photo in the Adventure Works photo application",
                    UserName = "AllisonBrown",
                    PhotoFile = getFileBytes("\\Images\\flower.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-5)
                },
                new Photo {
                    Title = "Sample Photo 2",
                    Description = "This is the second sample photo in the Adventure Works photo application",
                    UserName = "RogerLengel",
                    PhotoFile = getFileBytes("\\Images\\orchard.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-4)
                },
                new Photo {
                    Title = "Sample Photo 3",
                    Description = "This is the third sample photo in the Adventure Works photo application",
                    UserName = "AllisonBrown",
                    PhotoFile = getFileBytes("\\Images\\path.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-3)
                },
                new Photo {
                    Title = "Sample Photo 4",
                    Description = "This is the forth sample photo in the Adventure Works photo application",
                    UserName = "JimCorbin",
                    PhotoFile = getFileBytes("\\Images\\fungi.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-2)
                },
                new Photo {
                    Title = "Sample Photo 5",
                    Description = "This is the fifth sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\pinkflower.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-1)
                },
                new Photo {
                    Title = "Sample Photo 6",
                    Description = "This is the sixth sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\blackberries.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-11)
                },
                new Photo {
                    Title = "Sample Photo 7",
                    Description = "This is the seventh sample photo in the Adventure Works photo application",
                    UserName = "BernardDuerr",
                    PhotoFile = getFileBytes("\\Images\\coastalview.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-10)
                },
                new Photo {
                    Title = "Sample Photo 8",
                    Description = "This is the eigth sample photo in the Adventure Works photo application",
                    UserName = "FengHanYing",
                    PhotoFile = getFileBytes("\\Images\\headland.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-9)
                },
                new Photo {
                    Title = "Sample Photo 9",
                    Description = "This is the ninth sample photo in the Adventure Works photo application",
                    UserName = "FengHanYing",
                    PhotoFile = getFileBytes("\\Images\\pebbles.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-8)
                },
                new Photo {
                    Title = "Sample Photo 10",
                    Description = "This is the tenth sample photo in the Adventure Works photo application",
                    UserName = "SalmanMughal",
                    PhotoFile = getFileBytes("\\Images\\pontoon.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-7)
                },
                new Photo {
                    Title = "Sample Photo 11",
                    Description = "This is the eleventh sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\ripples.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-5)
                },
                new Photo {
                    Title = "Sample Photo 12",
                    Description = "This is the twelth sample photo in the Adventure Works photo application",
                    UserName = "JimCorbin",
                    PhotoFile = getFileBytes("\\Images\\rockpool.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-3)
                },
                new Photo {
                    Title = "Sample Photo 13",
                    Description = "This is the thirteenth sample photo in the Adventure Works photo application",
                    UserName = "AllisonBrown",
                    PhotoFile = getFileBytes("\\Images\\track.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-1)
                }
            };
            photos.ForEach(s => context.Photos.Add(s));
            context.SaveChanges();

            //Create some comments
            var comments = new List<Comment>
            {
                new Comment {
                    PhotoId = 1,
                    UserName = "JamieStark",
                    Subject = "Sample Comment 1",
                    Body = "This is the first sample comment in the Adventure Works photo application"
                },
                new Comment {
                    PhotoId = 1,
                    UserName = "JimCorbin",
                    Subject = "Sample Comment 2",
                    Body = "This is the second sample comment in the Adventure Works photo application"
                },
                new Comment {
                    PhotoId = 3,
                    UserName = "RogerLengel",
                    Subject = "Sample Comment 3",
                    Body = "This is the third sample photo in the Adventure Works photo application"
                }
            };
            comments.ForEach(s => context.Comments.Add(s));
            context.SaveChanges();
        }

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

    }
}