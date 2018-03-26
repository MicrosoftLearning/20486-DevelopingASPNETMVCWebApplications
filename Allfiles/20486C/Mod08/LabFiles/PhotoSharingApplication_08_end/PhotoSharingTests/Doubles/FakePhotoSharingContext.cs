using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PhotoSharingApplication.Models;

namespace PhotoSharingTests.Doubles
{
    class FakePhotoSharingContext : IPhotoSharingContext
    {


        //This object is a keyed collection we use to mock an 
        //entity framework context in memory
        SetMap _map = new SetMap();

        public IQueryable<Photo> Photos
        {
            get { return _map.Get<Photo>().AsQueryable(); }
            set { _map.Use<Photo>(value); }
        }

        public IQueryable<Comment> Comments
        {
            get { return _map.Get<Comment>().AsQueryable(); }
            set { _map.Use<Comment>(value); }
        }

        public bool ChangesSaved { get; set; }

        public int SaveChanges()
        {
            ChangesSaved = true;
            return 0;
        }

        public T Add<T>(T entity) where T : class
        {
            _map.Get<T>().Add(entity);
            return entity;
        }

        public Photo FindPhotoById(int Id)
        {
            Photo item = (from p in this.Photos
                    where p.PhotoId == Id
                    select p).First();
 
            return item;
        }

        public Photo FindPhotoByTitle(string Title)
        {
            Photo item = (from p in this.Photos
                          where p.Title == Title
                          select p).FirstOrDefault();

            return item;
        }

        public Comment FindCommentById(int Id)
        {
            Comment item = (from c in this.Comments
                          where c.CommentId == Id
                          select c).First();
            return item;
        }


        public T Delete<T>(T entity) where T : class
        {
            _map.Get<T>().Remove(entity);
            return entity;
        }

        class SetMap : KeyedCollection<Type, object>
        {

            public HashSet<T> Use<T>(IEnumerable<T> sourceData)
            {
                var set = new HashSet<T>(sourceData);
                if (Contains(typeof(T)))
                {
                    Remove(typeof(T));
                }
                Add(set);
                return set;
            }

            public HashSet<T> Get<T>()
            {
                return (HashSet<T>) this[typeof(T)];
            }

            protected override Type GetKeyForItem(object item)
            {
                return item.GetType().GetGenericArguments().Single();
            }
        }
    }
}
