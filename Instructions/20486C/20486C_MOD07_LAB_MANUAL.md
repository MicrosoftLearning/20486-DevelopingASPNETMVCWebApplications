# Module 7: Structuring ASP.NET MVC 5 Web Applications

# Lab: Structuring ASP.NET MVC 5 Web Applications

#### Scenario

An important design priority for the Photo Sharing application is that the visitors should be able to easily and logically locate photographs. Additionally, photo galleries and photos need to appear high in search engine results. To implement these priorities, you have been asked to configure routes that enable the entry of user-friendly URLs to access photos.

You have been asked to ensure that the URLs of the following forms work to display a photo:

- ~/photo/display/_PhotoId_.In this form of URL, PhotoId is the database Id of the photo object. This form of URL already works because it matches the default route.
- ~/photo/_PhotoId_.In this form of URL, PhotoId is the database Id of the photo object. This is the logical URL to enter when you know the Id of the photo that you want to access.
- ~/photo/title/_PhotoTitle_. In this form of URL,PhotoTitle is the title of the photo object. This is the logical URL to enter when you know the title of the photo that you want to access.

You have also been asked to implement the following navigation controls in the Photo Sharing application:

- A menu with links to the main site areas
- A breadcrumb control

These navigation controls will be added to the menu after the completion of the main site areas.

#### Objectives

After completing this lab, you will be able to:

- Add routes to the ASP.NET Routing Engine in an ASP.NET MVC application.
- Build navigation controls within ASP.NET views.

#### Lab Setup

Estimated Time: **40 minutes**

### Exercise 1: Using the Routing Engine

#### Scenario

In this exercise, you will:

- Create unit tests for the routes you wish to create.
- Add routes to the application that satisfy your tests.
- Try out routes by typing URLs in the Microsoft Edge Address bar.

This approach conforms to the principles of Test Driven Development (TDD).

The main tasks for this exercise are as follows:

1. Test the routing configuration.

2. Add and test the Photo Id route.

3. Add and test the Photo Title route.

4. Try out the new routes.

#### Task 1: Test the routing configuration.

1. Open the **PhotoSharingApplication** solution from the following location:

    - File location: **Allfiles\20486c\Mod07\LabFiles\PhotoSharingApplication_07_begin**

2. Add an existing code file to the **Photo Sharing Tests** project, which contains test doubles for HTTP objects, by using the following information:

    - Destination folder: **Doubles**
    - Source folder: **Allfiles\20486c\Mod07\LabFiles\Fake Http Classes**
    - Code file: **FakeHttpClasses.cs**

3. Add a reference from the **Photo Sharing Tests** project to the **System.Web** assembly.
4. Add a new **Unit Test** item to the **PhotoSharingTests** project. Name the file, **RoutingTests.cs**.
5. Add **using** statements to the RoutingTests.cs file for the following namespaces:

    - **System.Web.Routing**
    - **System.Web.Mvc**
    - **PhotoSharingTests.Doubles**
    - **PhotoSharingApplication**

6. Rename the **TestMethod1** test to **Test_Default_Route_ControllerOnly**.
7. In the **Test_Default_Route_ControllerOnly** test, create a new **var** by using the following information:

    - Name: **context**
    - Type: **FakeHttpContextForRouting**
    - Request URL: **~/ControllerName**

8. Create a new **RouteCollection** object named **routes** and pass it to the **RouteConfig.RegisterRoutes()** method.
9. Call the **routes.GetRouteData()** method to run the test by using the following information:

    - Return type: **RouteData**
    - Return object name: **routeData**
    - Method: **routes.GetRouteData**
    - HTTP context object: **context**

10. Assert the following facts:

    - That **routeData** is not null
    - That the **controller** value in **routeData** is &quot;ControllerName&quot;
    - That the **action** value in **routeData**  is &quot;Index&quot;
    - That the **id** value in **routeData**  is &quot;UrlParameter.Optional&quot;
    
11. Add a new test to the **RoutingTests** class named, **Test_Photo_Route_With_PhotoId**.
12. In the **Test_Photo_Route_With_PhotoId()** test method, create a new **var** by using the following information:

    - Name: **context**
    - Type: **FakeHttpContextForRouting**
    - Request URL: **~/photo/2**

13. Create a new **RouteCollection** object named **routes** and pass it to the **RouteConfig.RegisterRoutes()** method.
14. Call the **routes.GetRouteData()** method to run the test by using the following information:

    - Return type: **RouteData**
    - Return object name: **routeData**
    - Method: **routes.GetRouteData**
    - Http context object: **context**

15. Assert the following facts:

    - That **routeData** is not null
    - That the **controller** value in **routeData** is &quot;Photo&quot;
    - That the **action** value in **routeData**  is &quot;Display&quot;
    - That the **id** value in **routeData** is &quot;2&quot;

16. Add a new test to the **RoutingTests** class named **Test_Photo_Title_Route**
17. In the **Test_Photo_Title_Route** test method, create a new **var** by using the following information:

    - Name: **context**
    - Type: **FakeHttpContextForRouting**
    - Request URL: **~/photo/title/my%20title**

18. Create a new **RouteCollection** object named **routes** and pass it to the **RouteConfig.RegisterRoutes()** method.
19. Call the **routes.GetRouteData()** method to run the test by using the following information:

    - Return type: **RouteData**
    - Return object name: **routeData**
    - Method: **routes.GetRouteData**
    - HTTP context object: **context**

20. Assert the following facts:

    - That **routeData** is not null
    - That the **controller** value in **routeData** is &quot;Photo&quot;
    - That the **action** value in **routeData**  is &quot;DisplayByTitle&quot;
    - That the **title** value in **routeData** is &quot;my%20title&quot;

21. Run all the tests in the **Photo Sharing Tests** project to verify the test results.

   >**Note:** Two of the tests should fail because the routes that they test do not yet exist.

#### Task 2: Add and test the Photo Id route.

1. Open the **RouteConfig.cs** file in the **PhotoSharingApplication** project.
2. Add a new route to the Photo Sharing application by using the following information. Add the new route before the default route:

    - Name: **PhotoRoute**
    - URL: **photo/{id}**
    - Default controller: **Photo**
    - Default action: **Display**
    - Constraints: **id = &quot;[0-9]+&quot;**

3. Run all the tests in the **Photo Sharing Tests** project to verify the test results.

#### Task 3: Add and test the Photo Title route.

1. Add a new route to the Photo Sharing application by using the following information. Add the new route after the **PhotoRoute** route but before the default route:

    - Name: **PhotoTitleRoute**
    - URL: **photo/title/{title}**
    - Default controller: **Photo**
    - Default action: **DisplayByTitle**

2. Add a new action method to **PhotoController.cs** by using the following information:

    - Scope: **public**
    - Return type: **ActionResult**
    - Name: **DisplayByTitle**
    - Parameter: a **string** named **title**

3. In the **DisplayByTitle** action method, use the **context.FindPhotoByTitle()** method to locate a photo. If the **context.FindPhotoByTitle()** method returns **null**, return **HttpNotFound()**. Otherwise, pass the photo to the **Display** view.
4. Run all the tests in the **Photo Sharing Tests** project to verify the test results.

#### Task 4: Try out the new routes.

1. Start the **PhotoSharingApplication** project with debugging.
2. View properties of the **Display** link of any image on the home page, and note the route that has been used to formulate the link.
3. Display any image to verify the URL.
4. Access the following relative URL:

    - **/photo/title/sample photo 3**

5. Stop debugging.

>**Results**: After completing this exercise, you should have successfully created a Photo Sharing application with three configured routes that enable visitors to easily locate photos by using logical URLs.

### Exercise 2: Optional—Building Navigation Controls

#### Scenario

In this exercise, you will:

- Add the MVC site map provider to your Photo Sharing application.
- Use the MVC site map provider to create a menu and a breadcrumb control.

At this stage of development, most of the main areas in the Photo Sharing Application are not yet built; therefore, the menu will show only the home page and the All Photos gallery. Your team will add new nodes to the site map as areas of the site are completed.

Complete this exercise if time permits

The main tasks for this exercise are as follows:

1. Install the MVC site map provider.

2. Configure the MVC site map provider.

3. Render menus and breadcrumb trails.

4. Try out the menus.

#### Task 1: Install the MVC site map provider.

- Use the NuGet Package Manager to add **MvcSiteMapProvider** 4.6.22 to the application.

#### Task 2: Configure the MVC site map provider.

1. Open the **Mvc.sitemap** file and remove the **&lt;mvcSiteMapNode&gt;** element with the title, **About**.
2. Add an **&lt;mvcSiteMapNode&gt;** element within the **Home** node by using the following information:

    - Title: **All Photos**
    - Controller: **Photo**
    - Action: **Index**
    - Key: **AllPhotos**

3. Save the changes made to the **Mvc.sitemap** file.
4. Build the solution.

#### Task 3: Render menus and breadcrumb trails.

1. Render a site menu on the **Index** view by using the following information:

    - Helper: **Html.MvcSiteMap()**
    - Method: **Menu**
    - Start From Current Note: **False**
    - Starting Node in Child Level: **False**
    - Show Starting Node: **True**

2. Render a breadcrumb trail on the **Index** view by using the following information:

    - Helper: **Html.MvcSiteMap()**
    - Method: **SiteMapPath**

3. Render a site menu on the **Index** view by using the following information:

    - Helper: **Html.MvcSiteMap()**
    - Method: **Menu**
    - Start From Current Note: **False**
    - Starting Node in Child Level: **False**
    - Show Starting Node: **True**

4. Render a breadcrumb trail on the **Index** view by using the following information:

    - Helper: **Html.MvcSiteMap()**
    - Method: **SiteMapPath**

#### Task 4: Try out the menus.

1. Start debugging the **PhotoSharingApplication** project.
2. Use the menu option to browse to All Photos.
3. Use the breadcrumb trail to browse to the Home page.
4. Stop debugging and close the **Visual Studio** application.

>**Results**: After completing this exercise, you should have successfully created a Photo Sharing application with a simple site map, menu, and breadcrumb control.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
