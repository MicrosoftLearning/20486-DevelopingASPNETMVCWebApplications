# Module 9: Building Responsive Pages in ASP.NET MVC 5 Web Applications

# Lab: Building Responsive Pages in ASP.NET MVC 5 Web Applications

#### Scenario

Your manager has asked you to include comments for photos in the Photo Sharing application. Your manager has also highlighted that the performance of some pages in the application is too slow for a production site.

You want to ensure that comments for photos take minimal loading time, for which you decide to use partial page updates. You also want to return pages in quick time, while updated information is displayed, for which you decide to configure caching in your application.

#### Objectives

After completing this lab, you will be able to:

- Write controller actions that can be called asynchronously and return partial views.
- Use common AJAX helpers to call asynchronous controller actions, and insert the results into Razor views.
- Configure ASP.NET caches to serve pages in quick time.

#### Lab Setup

Estimated Time: **60 minutes**

### Exercise 1: Using Partial Page Updates

#### Scenario

You have been asked to include a comment functionality on the photo display view of the Photo Sharing application. You want to ensure high performance by using AJAX partial page updates.

In this exercise, you will

- Import a partially complete controller to add comments, and a view to delete comments.
- Add code to the controller for partial page update.

The main tasks for this exercise are as follows:

1. Import the Comment controller and Delete view.

2. Add the _CommentsForPhoto action and view.

3. Add the _Create Action and the _CreateAComment views.

4. Add the _CommentsForPhoto POST action.

5. Complete the _CommentsForPhoto view.

#### Task 1: Import the Comment controller and Delete view.

1. On the taskbar, click the **File Explorer** icon.
2. In the Libraries window, navigate to **Allfiles/20486C/Mod09/Labfiles/PhotoSharingApplication_09_begin**, and then double-click **PhotoSharingApplication.sln.**
3. In the Solution Explorer pane of the **PhotoSharingApplication - Microsoft Visual Studio** window, expand  **PhotoSharingApplication**, right-click **Views**, point to **Add**, and then click **New Folder**.
4. In the Solution Explorer pane, rename **New Folder1** as **Comment**, and then press Enter.
5. In the Solution Explorer pane, under Views, right-click **Comment**, point to **Add**, and then click **Existing Item**.
6. In the **Add Existing Item - PhotoSharingApplication** dialog box, navigate to **Allfiles/20486C/Mod09/Labfiles/Comment Components**, click **Delete.cshtml**, and then click **Add**.
7. In the Solution Explorer pane, right-click **Controllers**, point to **Add**, and then click **Existing Item**.
8. In the **Add Existing Item - PhotoSharingApplication** dialog box, navigate to **Allfiles/20486C/Mod09/Labfiles/Comment Components**, click **CommentController.cs**, and then click **Add**.

#### Task 2: Add the _CommentsForPhoto action and view.

1. Add a new action to **CommentController.cs** by using the following information:

	- Annotation: **ChildActionOnly**
	- Scope: **public**
	- Return type: **PartialViewResult**
	- Name: **_CommentsForPhoto**
	- Parameter: an integer named **PhotoId**

2. In the **_CommentsForPhoto** action, select all the comments in the database that have a **PhotoId** value equal to the **PhotoId** parameter, by using a LINQ query.
3. Save the **PhotoId** parameter value in the **ViewBag** collection to use it later in the view.
4. Return a partial view as the result of the **_CommentsForPhoto** action by using the following information:

	- View name: **_CommentsForPhoto**
	- Model: **comments.ToList()**

5. Add a new partial view to display a list of comments by using the following information:

	- Parent folder: **Views/Shared**
	- View name: **_CommentsForPhoto**
	- Model class: **Comment.(PhotoSharingApplication.Models)**
	- Create partial view: **Yes**.

6. Bind the **_CommentsForPhoto.cshtml** view to an enumerable collection of comments.
7. Create an **H3** element by using the following information:

	- Heading: **Comments**

8. After the heading, create a **DIV** element with the Id **comments-tool**. Within this **DIV** element, create a second **DIV** element with the Id **all-comments**.
9. For each item in the model, render a **DIV** element with the **photo-comment** class.
10. Within the **&lt;div class=&quot;photo-comment&quot;&gt;** element, add a **DIV** element with the **photo-comment-from** class. Within this **DIV** element, render the **UserName** value of the model item by using the **Html.DisplayFor()** helper.
11. Add a **DIV** element with the **photo-comment-subject** class. Within this **DIV** element, render the **Subject** value of the model item by using the **Html.DisplayFor()** helper.
12. Add a **DIV** element with the **photo-comment-body** class. Within this **DIV** element, render the **Body** value of the model item by using the **Html.DisplayFor()** helper.
13. Render a link to the **Delete** action by using the **Html.ActionLink()** helper. Pass the **item.CommentId** value as the **id** parameter.
14. In the **Views/Photo/Display.cshtml** view file, just before the **Back To List** link, render the **_CommentsForPhoto** partial view by using the following information:

	- Helper: **Html.Action()**
	- Action: **_CommentsForPhoto**
	- Controller: **Comment**
	- *PhotoId parameter: **Model.PhotoId**

15. Run the application in debugging mode and browse to **Sample Photo 1**. Observe the display of comments on the page.
16. Close Microsoft Edge.

#### Task 3: Add the _Create Action and the _CreateAComment views.

1. Add a new action to the **CommentController.cs** file by using the following information:

	- Scope: **public**
	- Return type: **PartialViewResult**
	- Name: **_Create**
	- Parameter: an integer named **PhotoId**.

2. In the **_Create** action, create a new **Comment** object and set its **PhotoId** property to equal the **PhotoId** parameter.
3. Save the **PhotoId** parameter value in the **ViewBag** collection to use it later in the view.
4. Return a partial view named **_CreateAComment**.
5. Add a new partial view for creating new comments by using the following information:

	- Parent folder: **Views/Shared**
	- View name: **_CreateAComment**
	- Model class: **Comment (PhotoSharingApplication.Models)**
	- Create partial view: **Yes**

6. In the **_CreateAComment** view, render validation messages by using the **Html.ValidationSummary()** helper. For the **excludePropertyErrors** parameter, pass **true**.
7. After the validation messages, add a **DIV** element with the **add-comment-tool** class.
8. Within the **&lt;div class=&quot;add-comment-tool&quot;&gt;** element, add a **DIV** element with no class or Id.
9. Within the **DIV** element you just created, add a **SPAN** element with the **editor-label** class and content **Subject:**
10. After the **SPAN** element you just created, add a second **SPAN** element with the **editor-field** class. Within this element, render the **Subject** property of the model by using the **Html.EditorFor()** helper.
11. Within the **&lt;div class=&quot;add-comment-tool&quot;&gt;** element, add a second **DIV** element with no class or Id.
12. Within the **DIV** element you just created, add a **SPAN** element with the **editor-label** class and content **Body:**
13. After the **SPAN** element you just created, add a second **SPAN** element with the **editor-field** class.Within this element, render the **Body** property of the model by using the **Html.EditorFor()** helper.
14. Within the **&lt;div class=&quot;add-comment-tool&quot;&gt;** element, add an **INPUT** element by using the following information:

	- Element: **&lt;input&gt;**
	- Type: **submit**
	- Value: **Create**

15. Save all your changes.

#### Task 4: Add the _CommentsForPhoto POST action.

1. Add a new action to the **CommentController.cs** file by using the following information:

	- Annotation: **HttpPost**
	- Scope: **public**
	- Return type: **PartialViewResult**
	- Name: **_CommentsForPhoto**
	- Parameter: a **Comment** object named **comment**.
	- Parameter: an integer named **PhotoId**.

2. In the **_ComentForPhoto** action, add the **comment** object to the **context** and save the changes to the **context**.
3. Select all the comments in the database that have a **PhotoId** value equal to the **PhotoId** parameter by using a LINQ query.
4. Save the **PhotoId** parameter value in the **ViewBag** collection to use it later in the view.
5. Return a partial view as the result of the **_CommentsForPhoto** action by using the following information:

	- View name: **_CommentsForPhoto**
	- Model: **comments.ToList()**

6. Save all the changes.

#### Task 5: Complete the _CommentsForPhoto view.

1. In the **_CommentsForPhoto.cshtml** view file, use a **using{}** block to render an HTML form around all tags by using the following information:

	- Helper: **Ajax.BeginForm()**
	- Action name: **_CommentsForPhoto**
	- PhotoId parameter: **ViewBag.PhotoId**
	- Ajax options: **UpdateTargetId = &quot;comment-tool&quot;**

2. In the form code block, in the **&lt;div class=&quot;comments-tool&quot;&gt;** element, add a new **DIV** element with the **add-comment-box** class and the Id **add-comment**.
3. In the **DIV** element you just created, render the **_Create** action of the **Comment** controller by using the **Html.Action()** helper. Pass the **ViewBag.PhotoId** value as the **PhotoId** parameter.
4. Add script tags to the **_MainLayout.cshtml** page that reference the following content delivery network (CDN) locations:

	http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.8.0.min.js

	http://ajax.aspnetcdn.com/ajax/mvc/3.0/jquery.unobtrusive-ajax.js

5. Start the web application in debugging mode, browse to **Sample Photo 1**, and observe the comments displayed.
6. Add a new comment to Sample Photo 1.

	- Subject: **Test Comment**
	- Body content: **This comment is to test AJAX-based partial page updates.**

7. Stop debugging.

   >**Results** : At the end of this exercise, you will have ensured that new comments can be added and displayed on the pages of the application without a complete page reload. You will create a Photo Sharing application with a comments tool, implemented by using partial page updates.

### Exercise 2: Optional—Configuring the ASP.NET Caches

#### Scenario

You have been asked to configure the ASP.NET caches in the Photo Sharing application to ensure optimal performance. Senior developers are particularly concerned that the All Photos gallery might render slowly because it will fetch and display many photos from the database at a time.

In this exercise, you will:

- Configure the output cache to store the photo index view.
- Use the developer tools in Microsoft Edge to examine the speed at which image files and pages render with and without caching.
- Configure the output cache to store the results of the GetImage action so that image files can be returned from the cache.

Complete this exercise if time permits.

The main tasks for this exercise are as follows:

1. Test the All Photos page with no caching.

2. Configure caching for the Index action.

3. Retest the All Photos page with Index caching.

4. Configure caching for the GetImage action.

5. Retest the All Photo page with GetImage caching.

#### Task 1: Test the All Photos page with no caching.

1. Start the application in debugging mode and configure the browser to always refresh the **page** from the server by using the Microsoft Edge developer tools.

2. Capture traffic between the browser and the server when the **All Photos** page is loaded, by using the Network tools.
3. Record the time taken by the server to render the **/Photo** page and return the page to the browser. This value is the **Request** duration, which you can find on the **Timings** tab.
4. Clear the first network capture, and capture a second request to the **All Photos** page.
5. Record the second instance of time taken by the server to render the **/Photo** page and return the page to the browser. Observe if the duration is less than the first instance.
6. Stop debugging.

#### Task 2: Configure caching for the Index action.

1. Open the **PhotoController.cs** code file, and add a **using** statement for the following namespace: **System.Web.UI**
2. Configure the **Index** action to use the output cache by using the following information:

	- Duration: **10 minutes**
	- Location: **OutputCacheLocation.Server**
	- Vary by parameters: **None**

3. Save all your changes.

#### Task 3: Retest the All Photos page with Index caching.

1. Start the application in debugging mode, and configure the browser to always refresh the page from the server, by using the Microsoft Edge developer tools.

2. Capture the traffic between the browser and the server when the **All Photos** page is loaded, by using the Network tools.
3. Record the time taken by the server to render the **/Photo** page and return the page to the browser. This value is the **Request** duration, which you can find on the **Timings** tab.
4. Clear the first network capture, and capture a second request to the **All Photos** page.
5. Record the second instance of the time taken by the server to render the **/Photo** page and return the page to the browser. Observe if the duration is less than the first instance.
6. Record the time taken by the server to render the **/Photo/GetImage/1** request.
7. Stop debugging.

#### Task 4: Configure caching for the GetImage action.

1. In the **PhotoController**, configure the **GetImage** action to use the output cache, by using the following information:

	- Duration: **10 minutes**.
	- Location: **OutputCacheLocation.Server**
	- Vary by parameters: **id**

2. Save all your changes.

#### Task 5: Retest the All Photo page with GetImage caching.

1. Start the application in debugging mode and configure the browser to always refresh the page from the server, by using the Microsoft Edge developer tools.

2. Capture the traffic between the browser and the server when the **All Photos** page is loaded, by using the Network tools.
3. Record the time taken by the server to render the **/Photo/GetImage/1** request.
4. Clear the first network capture, and capture a second request to the **All Photos** page.
5. Record the second instance of the time taken by the server is less than first instance to render the **/Photo/GetImage/1** request and return the page to the browser.
If the latest duration wasn’t reduced, then please re-try this task from step 1 by deleting your browser Cache.
  * To delete the browser cache:
  * Open **Microsoft Edge** window and then click **Ellipsis** and then click **Settings**.
  * Under **Clear Browsing** data, click **Choose what to clear**.
  * Ensure that **Cached data and files** checkbox is selected and then click **Clear**.
6. Close the developer tools, stop debugging, and close Visual Studio.

   >**Results** : At the end of this exercise, you will create a Photo Sharing application with the Output Cache configured for caching photos.
   
©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
