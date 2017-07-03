# Module 3: Developing ASP.NET MVC 4 Models

# Lesson 1: Creating MVC Models

### Demonstration: How to Add a Model

#### Demonstration Steps

1. On the **File** menu of the **Start Page - Microsoft Visual Studio** page, point to **New,** and then click **Project.**
2. In the navigation pane of the **New Project** page, expand **Installed**, expand **Templates**, and then expand **Visual C#**.
3. Under **Visual C#**, click **Web**, and then, in the result pane, click **ASP.NET MVC 4 Web Application**.
4. In the **Name** text box of the **New Project** dialog box, type **OperasWebSites**.
5. In the **New Project** dialog box, click **Browse**.
6. In the **Location** text box, go to **Allfiles (D):\Democode\Mod03**, and then click **Select Folder**.
7. In the **New Project** dialog box, click **OK**.
8. In the **Select a Template** list of the **New**** ASP.NET MVC 4 Project **dialog box, click** Empty **, and then click** OK**.
9. Inthe **Solution Explorer** pane of the **OperasWebSites - Microsoft Visual Studio** window, right-click **Models**, point to **Add**, and then click **Class**.
10. In the **Name** text box of the **Add New Item - OperasWebSites** dialog box, type **Opera.cs**, and then click **Add**.
11. In the **Opera** class of the **Opera.cs** code window, type the following code.

  ```cs
		public int OperaID { get; set; }
        public string Title { get; set; }
        public int Year { get; set; }
        public string Composer { get; set; }
```
12. Place the mouse cursor at the end of the **OperaID** property code, press Enter, and then type the following code.

  ```cs
		[Required]
        [StringLength(200)]
```
13. In the Required data annotation, right-click **Required**, point to **Resolve**, and then click **using System.ComponentModel.DataAnnotations**.
14. Place the mouse cursor at the end of the **Year** property, press Enter, and then type the following code.

  ```cs
		[Required]
```
15. Place the mouse cursor at the end of the Opera class, press Enter, and then type the following code.

  ```cs
		public class CheckValidYear : ValidationAttribute
        {
        }
```
16. In the **CheckValidYear** class, type the following code.

  ```cs
		public override bool IsValid(object value)
        {
            int year = (int)value;
            if (year < 1598)
            {
               return false;
            }
               else
            {
               return true;
            }
        }
```
17. In the **CheckValidYear** class, type the following code.

  ```cs
		public CheckValidYear()
        {
            ErrorMessage = "The earliest opera is Daphne, 1598, by Corsi, Peri, and Rinuccini";
        }
```
18. In the **Opera** class, place the mouse cursor at the end of the **Title** property code, press Enter, and then type the following code.

  ```cs
		[CheckValidYear]
```
19. On the **Build** menu of the **OperasWebSites - Microsoft Visual Studio** window, click **Build Solution**, and then note that the application is being built.
20. In the **OperasWebSites - Microsoft Visual Studio** window, click the **Close** button.

# Lesson 2: Working with Data

### Demonstration: How to Use Entity Framework Code

#### Demonstration Steps

1. In the **Solution Explorer** pane of the **OperasWebSite - Microsoft Visual Studio** window, click **web.config**.
2. In the **web.config** code window, place the mouse cursor at the end of the **&lt;/appsettings&gt;** tag, press Enter, and then type the following code.

  ```cs
		<connectionStrings>
          <add name="OperasDB"
           connectionString=
           "Data Source=(LocalDB)\v11.0;" +
           "AttachDbFilename=" +
           "|DataDirectory|\Operas.mdf;" +
           "Integrated Security=True"
           providerName=
            "System.Data.SqlClient" />
        </connectionStrings>
```
3. On the **Tools** menu of the **OperasWebSite - Microsoft Visual Studio** window, point to **Library Package Manager**, and then click **Package Manager Console**.
4. In **Package Manager Console** window, type the following command, and then press Enter.

  ```cs
		install-package entityframework –
        version 5.0.0.0
```
5. In the **Solution Explorer** pane, right-click **Models**, point to **Add**, and then click **Class**.
6. In the **Name** text box of the **Add New Item - OperasWebSite** dialog box, type **OperasDB**, and then click **Add**.
7. In the **OperasDB.cs** code window, locate the following code.

  ```cs
		using System.Web;
```
8. Place the mouse cursor at the end of the located code, press Enter, and then type the following code.

  ```cs
		using System.Data.Entity;
```
9. In the **OperasDB.cs** code window, locate the following code.

  ```cs
		public class OperaDB
```
10. Append the following code to the existing line of code.

  ```cs
		: DbContext
```
11. In the **OperaDB** class, type the following code.

  ```cs		
        public DbSet<Opera> Operas
            { get; set; }
```
12. In the **Solution Explorer** pane, right-click **Models**, point to **Add**, and then click **Class**.
13. In the **Name** text box of the **Add New Item - OperasWebSite** dialog box, type **OperasInitializer**, and then click **Add**.
14. In the **OperasInitializer.cs** code window, place the mouse cursor at the end of the **System.web** namespace code, press Enter, and then type the following code.

  ```cs
		using System.Data.Entity;
```
15. In the **OperasInitializer.cs** code window, locate the following code.

  ```cs
		public class OperasInitializer
```
16. Append the following code to the existing line of code.

  ```cs
		: DropCreateDatabaseAlways
             <OperasDB>
```
17. In the **OperasInitializer** class code block, type the following code, press Spacebar, and then click, **Seed(OperasDB context)**.

  ```cs
		override
```
18. In the **Seed** method, place the mouse cursor after the call to **base.Seed**, press Enter, and then type the following code.

  ```cs
		var operas = new List<Opera>
        {
             new Opera {
                 Title = "Cosi Fan Tutte",
                 Year = 1790,
                 Composer = "Mozart"
             }
        };
        operas.ForEach(s =>
            context.Operas.Add(s));
        context.SaveChanges();
```
19. In the **Solution Explorer** pane, click **Global.asax**.
20. In the **Global.asax** code window, place the cursor at the end of the **System.Web.Routing** namespace, press Enter, and then type the following code.

  ```cs
		using System.Data.Entity;
        using OperasWebSite.Models;
```
21. In the **Application\_Start** method code block, type the following code.

  ```cs
		Database.SetInitializer
             <OperasDB>
             (new OperasInitializer());
```
22. On the **Build** menu of the **OperasWebSite - Microsoft Visual Studio** window, click **Build Solution**, and then note that the application is built successfully.
23. In the **Solution Explorer** pane, right-click **Controllers**, click **Add**, and then click **Controller**.
24. In the **Controller Name** box, type **OperaController**.
25. In the **Template** box, click **MVC controller with read/write actions and views, using Entity Framework**.
26. In the **Model Class** box, click **Opera (OperasWebSite.Models)**.
27. In the **Data context class** box, click **OpersDB (OperasWebSite.Models)**, and then click **Add**.
28. In the **Solution Explorer** pane, in the **Views/Operas** folder, double-click **Create.cshtml**.
29. In the **Create.cshtml** code window, locate and delete the following code.

  ```cs
		@section Scripts {
             @Script.Render("~/bundles/jqueryval";)
        }
```
30. On the **DEBUG** menu of the **OperasWebSite - Microsoft Visual** Studio window, click **Start Debugging**

   >**Note:** An error message displays in the **Internet Explorer** window. The error message is expected because the home page view has not been added. 

31. In the Address bar of the **Internet Explorer** window, append the existing URL with **opera/index**, and then click **Go to**.
32. On the **Index** page, click **Create New**.
33. In the **Title** text box of the result page, type **Carmen**, and then, in the **Year** text box, type **1475**.
34. In the **Composer** text box, type **Bizet**, and then click **Create**.

   >**Note:** An error message is displayed by the custom validator.

35. In the **Year** text box, type **1875**, and then click **Create**.
36. In the **Internet Explorer** window, click **Close**.
37. In the **OperasWebSite - Microsoft Visual Studio** window, click **Close**.
