## Module 1: Exploring ASP.NET MVC 5

## Lab: Exploring ASP.NET MVC 5

#### Scenario

You are working as a junior developer at Adventure Works. You have been asked by a senior developer to investigate the possibility of creating a web-based photo sharing application for your organization's customers, similar to one that the senior developer has seen on the Internet. Such an application will promote a community of cyclists who use Adventure Works equipment, and the community members will be able to share their experiences. This initiative is intended to increase the popularity of Adventure Works Cycles, and thereby to increase sales. You have been asked to begin the planning of the application by examining an existing photo sharing application and evaluating its functionality. You have also been asked to examine programming models available to ASP.NET developers. To do this, you need to create basic web applications written with three different models: Web Pages, Web Forms, and MVC. Your manager has asked you to report on the following specific questions for each programming model:

- How does the developer set a connection string and data provider?
- How does the developer impose a consistent layout, with Adventure Works branding and menus, on all pages in the web application?
- How does the developer set a cascading style sheet with a consistent set of color, fonts, borders, and other styles?
- How does the developer add a new page to the application and apply the layout and styles to it?

#### Objectives

After completing this lab, you will be able to:

- Describe and compare the three programming models available in ASP.NET.
- Describe the structure of each web application developed in the three programming models—Web Pages, Web Forms, and MVC.
- Select an appropriate programming model for a given set of web application requirements.

#### Lab Setup

Estimated Time: **45 minutes**

### Exercise 1: Exploring a Photo Sharing Application

#### Scenario

In this exercise, you will begin by examining the photo sharing application.

The main tasks for this exercise are as follows:

1. Register a user account.

2. Upload and explore photos.

3. Use slideshows.

4. Test the authorization.

#### Task 1: Register a user account.

1. Navigate to the following location to open the **PhotoSharingSample.sln** file:

    - **Allfiles\Mod01\Labfiles\PhotoSharingSample**

2. Run the web application in non-debugging mode.
3. Create a new user account with the following credentials:

    - User name: _&lt;A user name of your choice&gt;_
    - Password: _&lt;A password of your choice&gt;_

#### Task 2: Upload and explore photos.

1. Add the following comment to the **Orchard** image:

    - Subject: **Just a Test Comment**
    - Comment: **This is a Sample**

2. Add a new photo to the application by using the following information:

    - Title of the photo: **Fall Fungi**
    - Navigation path to upload the photo: **Allfiles\Mod01\Labfiles\Pictures\fungi.jpg**
    - Description: **Sample Text**

3. Verify the description details of the newly added photo.

#### Task 3: Use slideshows.

1. Use the **Slideshow** feature.
2. Add the following images to your list of favorite photos:

    - Fall Fungi
    - Orchard
    - Flower

3. View the slideshow of the images selected as favorites.

#### Task 4: Test the authorization.

1. Log off from the application, and then attempt to add a comment for the Fall Fungi image.
2. Attempt to add a new photo to the Photo Index page.
3. Close the Microsoft Edge window and the Visual Studio application.

>**Results**: At the end of this exercise, you will be able to understand the functionality of a photo sharing application, and implement the required application structure in the Adventure Works photo sharing application.

### Exercise 2: Exploring a Web Pages Application

#### Scenario

In this exercise, you will create a simple Web Pages application and explore its structure.

The main tasks for this exercise are as follows:

1. Create a Web Pages application.

2. Explore the application structure.

3. Add simple functionality.

4. Apply the site layout.

#### Task 1: Create a Web Pages application.

1. Start Visual Studio 2017 and create a new Web Pages project by using the **ASP.NET Web Site (Razor v3)** C# template.
2. Run the new Web Pages application in Microsoft Edge and review the **Contact** page.
3. Stop debugging by closing Microsoft Edge.

#### Task 2: Explore the application structure.

1. Open the Web.config file and verify that the database provider used by the application is **.NET Framework Data Provider for Microsoft SQL Server Compact**.
2. Verify that the **Default.cshtml** page and the **Contact.cshtml** page are linked to the same layout.
3. Verify that the Site.css file is used to apply styles to all pages on the site. Note that the **_SiteLayout.cshtml** page is linked to the style sheet.

#### Task 3: Add simple functionality.

1. Add a new Razor v3 webpage to the application at the root level by using the following information:

    - Webpage name: **TestPage.cshtml**

2. Add an **H1** element to the TestPage.cshtml page by using the following information:

    - Content: **This is a Test Page**

3. Add a link to the **Default.cshtml** page by using the following information:

    - Start tag: **&lt;a&gt;**
    - Attribute: **href = &quot;~/TestPage.cshtml&quot;**
    - Content: **Test Page**
    - End tag: **&lt;/a&gt;**

4. Save all the changes.
5. Run the website, and view the page you added.
6. Stop debugging by closing Microsoft Edge.

#### Task 4: Apply the site layout.

1. Add the Razor code block to the TestPage.cshtml file.
2. In the new code block, set the TestPage to use the following layout:

    - Layout: **_SiteLayout.cshtml**

3. Save all the changes.
4. Run the web application in debugging mode and browse to TestPage.chstml.
5. Close all open applications.

>**Results**: At the end of this exercise, you will be able to build a simple Web Pages application in Visual Studio.

### Exercise 3: Exploring a Web Forms Application

#### Scenario

In this exercise, you will create a simple Web Forms application and explore its structure.

The main tasks for this exercise are as follows:

1. Create a Web Forms application.

2. Explore the application structure.

3. Add simple functionality.

4. Apply the master page.

#### Task 1: Create a Web Forms application.

1. Start Visual Studio 2017 and create a new Web Forms project, **TestWebFormsApplication**, by using the ASP.NET Web Forms Application template.
2. Run the new Web Forms application in Microsoft Edge and examine the **Contact** page.
3. Stop debugging by closing Microsoft Edge.

#### Task 2: Explore the application structure.

1. Verify that the ~/Site.Master file contains a common layout for all the pages on the site. Also verify that the **Default.aspx** and **Contact.aspx** pages are linked to the same layout.
2. Verify that the Site.css file is used to apply styles to all pages on the website. Note that the Site.Master file uses bundle reference to package the CSS files.

#### Task 3: Add simple functionality.

1. Add a new Web Forms page to the application at the route level by using the following information:

    - Name of the Web Form: **TestPage.aspx**

2. Add an **H1** element to the **Testpage.aspx** page by using the following information:

    - Content: **This is a Test Page**

3. Add a link to the **Default.aspx** page by using the following information:

    - Start tag: **&lt;a&gt;**
    - Attribute: **href = &quot;TestPage.aspx&quot;**
    - Content: **Test Page**
    - End tag: **&lt;/a&gt;**

4. Run the website in Microsoft Edge and view the newly added Web Form page.

#### Task 4: Apply the master page.

1. Add a new attribute to the **@ Page** directive in the TestPage.aspx file by using the following information:

    - Attribute name: **MasterPageFile**
    - Attribute value: **~/Site.Master**

2. Remove the static markup tags from TestPage.aspx and replace it with a Web Forms Content control by using the following information:

    - Start tag: **&lt;asp:Content&gt;**
    - Runat attribute: **server**
    - ID attribute: **BodyContent**
    - ContentPlaceHolderID: **MainContent**
    - Content: **&lt;h1&gt;This is a Test Page&lt;/h1&gt;**
    - End tag: **&lt;/asp:Content&gt;**

3. Save all the changes.
4. Run the created website and verify the contents of the TestPage.aspx file.
5. Close all open applications.

>**Results**: At the end of this exercise, you will be able to build a simple Web Forms application in Visual Studio.

### Exercise 4: Exploring an MVC Application

#### Scenario

In this exercise, you will create a simple MVC application and explore its structure.

The main tasks for this exercise are as follows:

1. Create an MVC 5 application.

2. Explore the application structure.

3. Add simple functionality.

4. Apply the site layout.

#### Task 1: Create an MVC 5 application.

1. Start Visual Studio 2017 and create a new **MVC** project by using the **ASP.NET Web Application** template. Choose the **MVC** template.
2. Run the new MVC application in Microsoft Edge, and explore the **Contact** page.
3. Stop debugging by closing Microsoft Edge.

#### Task 2: Explore the application structure.

1. Verify that the ~/Views/Shared/\_Layout.cshtml file contains a common layout for all pages on the website, and how pages link to the layout.
2. Verify that the Site.css file is used to apply styles to all pages on the website, and note how the pages link to the style sheet.

#### Task 3: Add simple functionality.

1. Add a new view to the application by using the following information:

    - Parent folder: **/Views/Home**
    - Name of the view: **TestPage.cshtml**
    - Clear the **Use a layout or master page** check box.

2. Add an **H1** element to the TestPage.cshtml view by using the following information:

    - Content: **This is a Test Page**

3. Add an action to the HomeController.cs file by using the following information:

    - Procedure name: **TestPage**
    - Return type: **ActionResult**
    - Procedure parameters: **None**
    - Return the view &quot;TestPage&quot;

4. Add a link to the **Index.cshtml** page by using the following information:

    - Start tag: **&lt;a&gt;**
    - Attribute: **href=&quot; ~/Home/TestPage&quot;**
    - Content: **Test Page**
    - End tag: **&lt;/a&gt;**

5. Save all the changes.
6. Run the website and view the page you added.
7. Stop debugging by closing Microsoft Edge.

#### Task 4: Apply the site layout.

1. Open the TestPage.cshtml file and remove the code that sets the Layout = null.
2. In the TestPage.cshtml file, remove all the tags except the **&lt;h1&gt;** tag and its contents.
3. Save all the changes.
4. Run the web application and browse to Test Page.
5. Close all the open applications.

>**Results**: At the end of this exercise, you will be able to build a simple MVC application in Visual Studio.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
