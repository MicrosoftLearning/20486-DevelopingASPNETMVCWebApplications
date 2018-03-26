# Module 5: Developing ASP.NET MVC 5 Views

# Lab: Developing ASP.NET MVC 5 Views

#### Scenario

You have been asked to add the following views to the photo sharing application:

- _A Display view for the Photo model objects_. This view will display a single photo in a large size, with the title, description, owner, and created date properties.
- _A Create view for the Photo model objects_. This view will enable users to upload a new photo to the gallery and set the title and description properties.
- _A Photo Gallery partial view_. This view will display many photos in thumbnail sizes, with the title, owner, and created date properties. This view will be used on the **All Photos** webpage to display all the photos in the application. In addition, this view will also be used on the home page to display the three most recent photos.

After adding these three views to the photo sharing application, you will also test the working of the web application.

#### Objectives

After completing this lab, you will be able to:

- Add Razor views to an MVC application and set properties such as scaffold and model binding.
- Write both HTML markup and C# code in a view by using Razor syntax.
- Create a partial view and use it to display re-usable markup.

#### Lab Setup

Estimated Time: **60 minutes**

### Exercise 1: Adding a View for Photo Display

#### Scenario

In this exercise, you will:

- Create a new view in the Photo Sharing web application to display single photos in large size.
- Display the properties of a photo such as title, description, and created date.

The main tasks for this exercise are as follows:

1. Add a new display view.

2. Complete the photo display view.

#### Task 1: Add a new display view.

1. Open the **Photo Sharing Application** solution from the following location:

   - File location: **Allfiles\20486C\Mod05\Labfiles\PhotoSharingApplication_05_begin**

2. Open the **PhotoController.cs** code window.
3. Build the solution
4. Add a new view to the **Display** action in the **PhotoController** by using the following information:

   - Name: **Display**
   - Model class: **Photo(PhotoSharingApplication.Models)**
   - Scaffold template: **Empty**
   - Use a layout page: **None**

#### Task 2: Complete the photo display view.

1. Add a title to the display view by using the **Title** property of the **Model** object.
2. Add an **H2** element to the body page to display the photo title on the page by using the **Title** property of the **Model**  object.
3. Add an **&lt;img&gt;** tag to display the photo on the page by using the following information:

   - Width: **800**
   - src: **Empty**

4. Add the **URL.Action** helper to the **src** attribute of the **&lt;img&gt;** tag by using the following information:

   - Method: **Url.Action()**
   - Action name: **GetImage**
   - Controller name: **Photo**
   - Route values: **new { id=Model.PhotoId }**

5. Add a **P** element to display the **Description**  property from the model by using the following information:

   - Helper: **Html.DisplayFor**
   - Lamda expression: **model =&gt; model.Description**

6. Add a **P** element to display the **UserName** property from the model by using the following information:

   - Helpers:
     - **Html.DisplayNameFor**
     - **HtmlDisplayFor**
   - Lamda expression: **model => model.UserName**

7. Add a **P** element to display the **CreatedDate** property from the model by using the following information:

   - Helpers:
     - **Html.DisplayNameFor**
     - **Html.DisplayFor**
   - Lamda expression: **model => model.CreatedDate**

8. Add a **P** element to display a link to the **Index** controller action by using the following information:

   - Helper: **HTML.ActionLink**
   - Content: **Back to List**

   >**Note:** You will create the **Index** action and view for the **PhotoController** later in this lab.

9. Save the **Display.cshtml** file.

>**Results** : After completing this exercise, you will be able to add a single display view to the Photo Sharing web application and display the properties of a photo.

### Exercise 2: Adding a View for New Photos

#### Scenario

In this exercise, you will

- Create a view to upload new photos for display in the Photo Sharing application.
- Display the properties of a photo, such as title, description, and created date.

The main tasks for this exercise are as follows:

1. Add a new create view.

2. Complete the photo create view.

#### Task 1: Add a new create view.

- Create a new view for the **Create** action of the **PhotoController** class by using the following information:

   - Name: **Create**
   - Model class: **Photo(PhotSharingApplication.Models)**
   - Scaffold template: **Empty**
   - Partial view: **None**
   - Use a layout page: **None**

#### Task 2: Complete the photo create view.

1. Add the following title to the **Create** view:

   - Title: **Create New Photo**

2. Add an **H2** element to the body page to display the heading as **Create New Photo**.
3. Create a form on the page by using the following information within an **@using** statement:

   - Helper: **Html.BeginForm**
   - Action: **Create**
   - Controller name: **Photo**
   - Form method: **FormMethod.Post**
   - Parameter: Pass the HTML attribute **enctype = "multipart/form-data"**

4. In the form, use the **Html.ValidationSummary** helper to render validation messages.
5. After the **ValidationSummary**, add a **P** element to display controls for the **Title** property of the model by using the following information:

   - Helpers:

     - **LabelFor**
     - **EditorFor**
     - **ValidationMessageFor**

6. After the controls for the **Title** property, add a **P** element to display a label for the **PhotoFile** property, and an **&lt;input&gt;** tag by using the following information:

   - Helper: **LabelFor**
   - Input type: **file**
   - Name: **Image**

7. After the **PhotoFile** controls, add a **P** element to display controls for the **Description** property of the model by using the following information:

   - Helpers:

     - **LabelFor**
     - **EditorFor**
     - **ValidationMessageFor**

8. After the **Description** controls, add a **P** element to display read-only controls for the **UserName** property of the model by using the following information:

   - Helpers:

     - **LabelFor**
     - **DisplayFor**

9. After the **UserName** controls, add a **P** element to display read-only controls for the **CreatedDate** property of the model by using the following information:

   - Helpers:

     - **LabelFor**
     - **DisplayFor**

10. After the **CreatedDate** controls, add a **P** element that contains an **&lt;input&gt;** tag by using the following information:

    - Input type: **submit**
    - Value: **Create**
    - Add an action link to the **Index** action with the text **Back to List**.

11. Save the **Create.cshtml** file.

>**Results** : After completing this exercise, you will be able to create a web application with a Razor view to display new photos.

### Exercise 3: Creating and Using a Partial View

#### Scenario

In this exercise, you will:

- Add a gallery action to the Photo Controller.
- Add a photo gallery partial view.
- Complete the photo gallery partial view.
- Use the photo gallery partial view.

The main tasks for this exercise are as follows:

1. Add a gallery action to the Photo Controller.

2. Add a photo gallery partial view.

3. Complete the photo gallery partial view.

4. Use the photo gallery partial view.

#### Task 1: Add a gallery action to the Photo Controller.

1. Add a new action to the **PhotoController.cs** file by using the following information:

   - Annotation: **ChildActionOnly**
   - Scope: **public**
   - Return Type: **ActionResult**
   - Name: **_PhotoGallery**
   - Parameter: an **Integer** called **number** with a default value of 0

2. Create a new **List** of **Photo** objects named **photos**. Add an **if** statement, to set **photos** to include all the **Photos** in the **context** object, if the **number** parameter is zero.
3. If the **number** parameter is not zero, set **photos** to list the most recent **Photo** objects. The number of **Photo** objects in the list should be the **number** attribute.
4. Pass the **photos** object to the partial view **_PhotoGallery** and return the view.
5. Save the **PhotoController.cs** file.

#### Task 2: Add a photo gallery partial view.

1. Create a new partial view for the **_PhotoGallery** action in the PhotoController.cs file by using the following information:

   - Name: **_PhotoGallery**
   - Model class: **Photo**
   - Scaffold template: **Empty**

2. Create a new folder in the **PhotoSharingApplication** project by using the following information:

   - Parent folder: **Views**
   - Folder name: **Shared**

3. Move the **_PhotoGallery.cshtml** view file from the **Photo folder** to the Shared folder.

#### Task 3: Complete the photo gallery partial view.

1. In the **_PhotoGallery.cshtml** partial view file, bind the view to an enumerable list of **Photo** model objects.
2. In the _PhotoGallery.cshtml partial view file, add a **For Each** statement that loops through all the items in the **Model**.
3. In the **For Each** statement, add an **H3** element that renders the **item.Title** property.
4. After the **H3** element, add an **if** statement that checks that the **item.PhotoFile** value is not null.
5. If the **item.PhotoFile** value is not null, render an **&lt;img&gt;** tag with **width 200**. Call the **UrlAction** helper to set the **src** attribute by using the following information:

   - Action: **GetImage**
   - Controller: **Photo**
   - Parameters: for the **id** parameter, pass **item.PhotoId**

6. After the **if** statement, add a **P** element, and call the **@Html.DisplayFor** helper to render the words **Created By:** followed by the value of the **item.UserName** property.
7. After the **UserName** display controls, add a **P** element, and call the **@Html.DisplayFor** helper to render the words  **Created On:** followed by the value of the **item.CreatedDate** property.
8. After the **CreatedDate** display controls, call the **Html.ActionLink** helper to render a link by using the following information:

   - Link text: **Display**
   - View name: **Display**
   - Parameters: pass the **item.PhotoId** value as the **id** parameter

9. Save the **_PhotoGallery.cshtml** file.

#### Task 4: Use the photo gallery partial view.

1. Modify the **Index** action in the PhotoController.cs so that no model class is passed to the **Index** view.
2. Create a view for the **Index** action in the PhotoController.cs file by using the following information:

   - Name: **Index**
   - Use a layout page: **None**

3. In the **Index.cshtml** file, change the title to **All Photos**.
4. Add an **H2** element to the page body to display the heading as **All Photos**
5. Add a **P** element to add a link to the **Create** action in the **Photo** controller by using the following information:

   - Helper: **Html.ActionLink**
   - Link text: **Add a Photo**
   - Action name: **Create**
   - Controller name: **Photo**

6. Insert the **_PhotoGallery** partial view by using the following information:

   - Helper: **Html.Action**
   - Action name: **_PhotoGallery**
   - Controller name: **Photo**

7. Save the **Index.cshtml** file.

>**Results** : After completing this exercise, you will be able to create a web application with a partial view to display multiple photos.

### Exercise 4: Adding a Home View and Testing the Views

#### Scenario

In this exercise, you will create a home page that re-uses the photo gallery object, but displays only the three most recent photos.

The main tasks for this exercise are as follows:

1. Add a Controller and View for the home page.

2. Use the web application.

#### Task 1: Add a Controller and View for the home page.

1. Add a new **Controller** to the home page by using the following information:

   - Controller name: **HomeController**
   - Template: **MVC 5 Controller - Empty**

2. Add a new view to the **Index** action in **HomeController** by using the following information:

   - View name: **Index**
   - Use a layout page: **None**

3. Change the title of the page to **Welcome to Adventure Works Photo Sharing**.
4. Add the following text to the home page:

   - **Welcome to Adventure Works Photo Sharing! Use this site to share your adventures.**

5. Add an **H2** element to display the heading as **Latest Photos**.
6. Insert the **_PhotoGallery** partial view by using the following information:

   - Helper: **Html.Action**
   - Action name: **_PhotoGallery**
   - Controller name: **Photo**
   - Parameters: for the **number** parameter, pass the value **3**

7. Save the **Index.cshtml** file.

#### Task 2: Use the web application.

1. Start the Photo Sharing web application with debugging.
2. Verify the number of photos displayed on the home page.
3. Display a photo of your choice to verify whether the display shows the required information.
4. Verify the number of photos displayed on the **All Photos** page.
5. Add a new photo of your choice to the application by using the following information:

   - Title: **My First Photo**
   - Description: **This is the first test of the Create photo view**.
   - File path: **Allfiles\20486C\Mod05\Labfiles\SamplePhotos**

6. Close **Microsoft Edge** and **Microsoft Visual Studio**.

>**Results**: After completing this exercise, you will be able to create a web application in which users can upload and view the photos.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
