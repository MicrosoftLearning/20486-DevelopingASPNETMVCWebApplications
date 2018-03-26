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
                    CreatedDate = DateTime.Today.AddDays(-5),
                    Location = "Paris, France",
                    Latitude = "48.85693",
                    Longitude = "2.3412"
                },
                new Photo {
                    Title = "Sample Photo 2",
                    Description = "This is the second sample photo in the Adventure Works photo application",
                    UserName = "RogerLengel",
                    PhotoFile = getFileBytes("\\Images\\orchard.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-14),
                    Location = "London, UK",
                    Latitude = "51.506321",
                    Longitude = "-0.12714"
                },
                new Photo {
                    Title = "Sample Photo 3",
                    Description = "This is the third sample photo in the Adventure Works photo application",
                    UserName = "AllisonBrown",
                    PhotoFile = getFileBytes("\\Images\\path.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-14),
                    Location = "Tokyo, Japan",
                    Latitude = "35.683208",
                    Longitude = "139.808945"
                },
                new Photo {
                    Title = "Sample Photo 4",
                    Description = "This is the forth sample photo in the Adventure Works photo application",
                    UserName = "JimCorbin",
                    PhotoFile = getFileBytes("\\Images\\fungi.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-12),
                    Location = "Moscow, Russia",
                    Latitude = "55.751709",
                    Longitude = "37.618023"
                },
                new Photo {
                    Title = "Sample Photo 5",
                    Description = "This is the fifth sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\pinkflower.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-11),
                    Location = "Buenos Aires, Argentina",
                    Latitude = "-34.608521",
                    Longitude = "-58.373539"
                },
                new Photo {
                    Title = "Sample Photo 6",
                    Description = "This is the sixth sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\blackberries.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-11),
                    Location = "Washington, DC",
                    Latitude = "38.890369",
                    Longitude = "-77.03196"
                },
                new Photo {
                    Title = "Sample Photo 7",
                    Description = "This is the seventh sample photo in the Adventure Works photo application",
                    UserName = "BernardDuerr",
                    PhotoFile = getFileBytes("\\Images\\coastalview.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-10),
                    Location = "Brisbane, Australia",
                    Latitude = "-27.46846",
                    Longitude = "153.023422"
                },
                new Photo {
                    Title = "Sample Photo 8",
                    Description = "This is the eigth sample photo in the Adventure Works photo application",
                    UserName = "FengHanYing",
                    PhotoFile = getFileBytes("\\Images\\headland.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-9),
                    Location = "Mombasa, Kenya",
                    Latitude = "-4.00423",
                    Longitude = "39.71674"
                },
                new Photo {
                    Title = "Sample Photo 9",
                    Description = "This is the ninth sample photo in the Adventure Works photo application",
                    UserName = "FengHanYing",
                    PhotoFile = getFileBytes("\\Images\\pebbles.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-8),
                    Location = "Chennai, India",
                    Latitude = "13.09106",
                    Longitude = "80.291191"
                },
                new Photo {
                    Title = "Sample Photo 10",
                    Description = "This is the tenth sample photo in the Adventure Works photo application",
                    UserName = "SalmanMughal",
                    PhotoFile = getFileBytes("\\Images\\pontoon.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-7),
                    Location = "Kingston, Jamaica",
                    Latitude = "17.97097",
                    Longitude = "-76.788239"
                },
                new Photo {
                    Title = "Sample Photo 11",
                    Description = "This is the eleventh sample photo in the Adventure Works photo application",
                    UserName = "JamieStark",
                    PhotoFile = getFileBytes("\\Images\\ripples.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-5),
                    Location = "Vancouver, BC",
                    Latitude = "49.260422",
                    Longitude = "-123.113358"
                },
                new Photo {
                    Title = "Sample Photo 12",
                    Description = "This is the twelth sample photo in the Adventure Works photo application",
                    UserName = "JimCorbin",
                    PhotoFile = getFileBytes("\\Images\\rockpool.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-3),
                    Location = "Beijing, China",
                    Latitude = "39.90657",
                    Longitude = "116.38765"
                },
                new Photo {
                    Title = "Sample Photo 13",
                    Description = "This is the thirteenth sample photo in the Adventure Works photo application",
                    UserName = "AllisonBrown",
                    PhotoFile = getFileBytes("\\Images\\track.jpg"),
                    ImageMimeType = "image/jpeg",
                    CreatedDate = DateTime.Today.AddDays(-1),
                    Location = "Stockholm, Sweden",
                    Latitude = "59.332329",
                    Longitude = "18.062929"
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