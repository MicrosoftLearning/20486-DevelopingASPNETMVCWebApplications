# Module 3: Developing ASP.NET MVC 5 Models

# Lesson 1: Creating MVC Models

### Demonstration: How to Add a Model

#### Preparation Steps

1. Ensure that you have cloned the 20486C directory from GitHub. It contains the code segments for this course's labs and demos. 
https://github.com/MicrosoftLearning/20486-DevelopingASPNETMVCWebApplications/tree/master/Allfiles


#### Demonstration Steps

1. On the **File** menu of the **Start Page - Microsoft Visual Studio** window, point to **New** and then click **Project**.
2. In the navigation pane of the **New Project** dialog box, expand **Installed**, and then expand **Visual C#**.
3. Under **Visual C#**, click **Web**, and then, in the result pane, click **ASP.NET Web Application (.NET Framework)**.
4. In the **Name** text box of the **New Project** dialog box, type **OperasWebSites**.
5. In the **New Project** dialog box, click **Browse**.
6. In the **Location** text box, go to **Allfiles/20486C/Mod03/Democode**, and then click **Select Folder**.
7. In the **New Project** dialog box, click **OK**.
8. In the **New ASP.NET Web Application - OperasWebSites** dialog box, click **MVC**, and then click **OK**. 
9. In the **Solution Explorer** pane of the **OperasWebSites - Microsoft Visual Studio** window, right-click **Models**, point to **Add**, and then click **Class**.
10. In the **Name** text box of the **Add New Item - OperasWebSites** dialog box, type **Opera.cs**, and then click **Add**.
11. In the **Opera** class of the **Opera.cs** code window, type the following code.

  ```cs
        public int OperaId { get; set; }
        public string Title { get; set; }
        public int Year { get; set; }
        public string Composer { get; set; }
```
12. Place the mouse cursor at the end of the **OperaId** property code, press Enter, and then type the following code.

  ```cs
        [Required]
        [StringLength(200)]
```
13. In the Required data annotation, right-click **Required**, point to **Quick Actions and Refactorings...** and then click **using System.ComponentModel.DataAnnotations;**

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
20. In the **OperasWebSites - Microsoft Visual Studio** window, click **Close**.

# Lesson 2: Working with Data

### Demonstration: How to Use Entity Framework Code

#### Preparation Steps

1. Ensure that you have cloned the 20486C directory from GitHub. It contains the code segments for this course's labs and demos. 
https://github.com/MicrosoftLearning/20486-DevelopingASPNETMVCWebApplications/tree/master/Allfiles

#### Demonstration Steps

1. Open the **OperasWebsites.sln** file from **Allfiles\20486c\Mod03\Democode\OperasWebSites**
2. On the **Tools** menu of the **OperasWebSites - Microsoft Visual Studio** window, point to **NuGet Package Manager**, and then click **Package Manager Console**.
3. In **Package Manager Console** window, type the following command, and then press Enter.

  ```cs
		Install-Package EntityFramework -Version 6.1.3
```

4. In the **Solution Explorer** pane of the **OperasWebSites - Microsoft Visual Studio** window, click **web.config**.

5. In the **web.config** code window, place the mouse cursor at the end of the **&lt;/appsettings&gt;** tag, press Enter, and then type the following code.

  ```cs
	<connectionStrings>
	<add name="OperasDB"
	connectionString="Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\Operas.mdf;Integrated Security=True;"
	providerName="System.Data.SqlClient" />
	</connectionStrings>
```
6. In the **Solution Explorer** pane, right-click **Models**, point to **Add**, and then click **Class**.
7. In the **Name** text box of the **Add New Item - OperasWebSites** dialog box, type **OperasDB**, and then click **Add**.
8. In the **OperasDB.cs** code window, locate the following code.

  ```cs
		using System.Web;
```
9. Place the mouse cursor at the end of the located code, press Enter, and then type the following code.

  ```cs
		using System.Data.Entity;
```
10. In the **OperasDB.cs** code window, locate the following code.

  ```cs
		public class OperasDB
```
11. Append the following code to the existing line of code.

  ```cs
		: DbContext
```
12. In the **OperasDB** class, type the following code.

  ```cs		
        public DbSet<Opera> Operas{ get; set; }
```
13. In the **Solution Explorer** pane, right-click **Models**, point to **Add**, and then click **Class**.
14. In the **Name** text box of the **Add New Item - OperasWebSites** dialog box, type **OperasInitializer**, and then click **Add**.
15. In the **OperasInitializer.cs** code window, place the mouse cursor at the end of the **System.web** namespace code, press Enter, and then type the following code.

  ```cs
		using System.Data.Entity;
```
16. In the **OperasInitializer.cs** code window, locate the following code.

  ```cs
		public class OperasInitializer
```
17. Append the following code to the existing line of code.

  ```cs
		: DropCreateDatabaseAlways<OperasDB>
```
18. In the **OperasInitializer** class code block, type the following code, press Spacebar, and then click, **Seed(OperasDB context)**.

  ```cs
		override
```
19. In the **Seed** method, place the mouse cursor after the call to **base.Seed**, press Enter, and then type the following code.

  ```cs
        var operas = new List<Opera>
        {
             new Opera {
                 Title = "Cosi Fan Tutte",
                 Year = 1790,
                 Composer = "Mozart"
             }
        };
        operas.ForEach(s =>context.Operas.Add(s));
        context.SaveChanges();
```
20. In the **Solution Explorer** pane, click **Global.asax**.
21. In the **Global.asax** code window, place the cursor at the end of the **System.Web.Routing** namespace, press Enter, and then type the following code.

  ```cs
	   using System.Data.Entity;
       using OperasWebSites.Models;
```
22. In the **Application\_Start** method code block, type the following code.

  ```cs
		Database.SetInitializer<OperasDB>(new OperasInitializer());           
```
23. On the **Build** menu of the **OperasWebSites - Microsoft Visual Studio** window, click **Build Solution**, and then note that the application is built successfully.
24. In the **Solution Explorer** pane, right-click **Controllers**, click **Add**, and then click **Controller**.
25. In the **Scaffold** dialog box, click **MVC 5 controller with views, using Entity Framework**, and then click **Add**. 
26. In the **Controller Name** box, type **OperaController**.
27. In the **Model Class** box, click **Opera (OperasWebSite.Models)**.
28. In the **Data context class** box, click **OperasDB (OperasWebSite.Models)**, and then click **Add**.
29. In the **Solution Explorer** pane, in the **Views/Opera** folder, double-click **Create.cshtml**.
30. In the **Create.cshtml** code window, locate and delete the following code.

  ```cs
		@section Scripts {@Script.Render("~/bundles/jqueryval")}
```
31. On the **DEBUG** menu of the **OperasWebSites - Microsoft Visual** Studio window, click **Start Debugging**
32. In the Address bar of the **Microsoft Edge** window, replace the existing URL with **opera/index**, and then click **Go to**.
33. On the **Index** page, click **Create New**.
34. In the **Title** text box of the result page, type **Carmen**, and then, in the **Year** text box, type **1475**.
35. In the **Composer** text box, type **Bizet**, and then click **Create**.

   >**Note:** An error message is displayed by the custom validator.

36. In the **Year** text box, type **1875**, and then click **Create**.
37. In the **Microsoft Edge** window, click **Close**.
38. In the **OperasWebSites - Microsoft Visual Studio** window, click **Close**.
39. In the **Microsoft Visual Studio** dialog box, click **Yes** to stop the debugging.

©2016 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
