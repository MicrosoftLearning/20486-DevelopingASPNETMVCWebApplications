## Module 6: Testing and Debugging ASP.NET MVC 5 Web Applications

## Lab: Testing and Debugging ASP.NET MVC 5 Web Applications

#### Scenario

The Photo Sharing application is in the early stages of development. However, frequent errors are hindering the productivity of the development team. The senior developer advises that you intercept exceptions and other flaws as early as possible. You have been asked to perform unit tests of the PhotoController to ensure that all scenarios work as expected and to avoid problems later in the web application development life cycle. You have also been asked to ensure that when critical errors occur, developers can obtain helpful technical information.

#### Objectives

After completing this lab, you will be able to:

- Perform unit tests of the components of an MVC web application.
- Configure an exception handling strategy for an MVC web application.
- Use Visual Studio debugging tools against a web application.

#### Lab Setup

Estimated Time: **90 minutes**

### Exercise 1: Performing Unit Tests

#### Scenario

In this exercise, you will:

- Create a test project and write the following tests.

- **Test\_Index\_Return\_View:** This test checks that the **Index** action returns a view named Index.
- **Test\_PhotoGallery\_Model\_Type:** This test checks that the **\_PhotoGallery** action passes an enumerable list of **Photo**  objects to the **\_PhotoGallery** partial view.
- **Test\_GetImage\_Return\_Type:** This test checks that the **GetImage** action returns a file and not a view.
- **Test\_PhotoGallery\_No\_Parameter:** This test checks that when you call the **\_PhotoGallery** action without any parameters, the action passes all the photos in the context to the **\_PhotoGallery** partial view.
- **Test\_PhotoGallery\_Int\_Parameter:** This test checks that when you call the **\_PhotoGallery** action with an **integer**  parameter, the action passes the corresponding number of photos to the **\_PhotoGallery** action.

- Implement a repository.
- Refactor the PhotoController to use a repository.
- Refactor tests to use a mock repository.

   >**Note:** The tests you add to the solution in this exercise will improve the quality of code and prevent bugs as development proceeds. However, this exercise does not conform to the principles of TDD because the PhotoController class already exists. In TDD, you would create these and other tests first, and then create a PhotoController class that passes the tests. 

The main tasks for this exercise are as follows:

1. Create a test project.

2. Write the tests

3. Implement a repository

4. Refactor the photo controller to use the repository

5. Refactor the tests to use a mock repository

6. Add further tests

#### Task 1: Create a test project.

1. Open the **PhotoSharingApplication** solution from the following location:

   - File location: **Allfiles\20486C\Mod06\LabFiles\PhotoSharingApplication_06_begin**

3. Add a new project to the solution for unit tests by using the following information:

   - Template: **Unit Test Project (.NET Framework)**
   - Name: **PhotoSharingTests**

4. Add a reference to the **PhotoSharingApplication** project in the **PhotoSharingTests** project.
5. Add a reference to the **System.Web.Mvc** assembly in the **PhotoSharingTests** project by using the following information:

   - MVC version: **5.2.3**

#### Task 2: Write the tests

1. Rename the UnitTest1 class as PhotoControllerTests.

2. Rename the TestMethod1 method as Test\_Index\_Return\_View.
3. Add **using** statements for the following namespaces:

   - **System.Collections.Generic**
   - **System.Web.Mvc**
   - **PhotoSharingApplication.Models**
   - **PhotoSharingApplication.Controllers**

4. In the **Test\_Index\_Return\_View** test, create a new **PhotoController**, call the **Index** action, and assert that the name of the result view is **Index**.
5. Add a new test method by using the following information:

   - Annotation: **[TestMethod]**
   - Scope: **public**
   - Return type: **void**
   - Name: **Test\_PhotoGallery\_Model\_Type**
   - Parameters: **None**

6. In the **Test\_PhotoGallery\_Model\_Type** test, create a new **PhotoController**, call the **\_PhotoGallery** action, and assert that the type of the result model is **List&lt;Photo&gt;**.
7. Add a new test method by using the following information:

   - Annotation: **[TestMethod]**
   - Scope: **public**
   - Return type: **void**
   - Name: **Test\_GetImage\_Return\_Type**
   - Parameters: None

8. In the **Test\_GetImage\_Return\_Type** test, create a new **PhotoController**, call the **GetImage** action, and assert that the result type is **FileContentResult**.
9. Run all the tests in the **PhotoSharingTests** project and examine the results.

#### Task 3: Implement a repository

1. Add a new interface called **IPhotoSharingContext** to the Models folder in the **PhotoSharingApplication** project.

2. Set public scope to the new interface.
3. Add the **Photos** property to the **IPhotoSharingContext** interface by using the following information:

   - Type: **IQueryable&lt;Photo&gt;**
   - Name: **Photos**
   - Access: **Read only**

4. Add the **Comments** property to the **IPhotoSharingContext** interface by using the following information:

   - Type: **IQueryable&lt;Comment&gt;**
   - Name: **Comments**
   - Access: **Read only**

5. Add the **SaveChanges** method to the **IPhotoSharingContext** interface by using the following information:

   - Return type: **Integer**
   - Name: **SaveChanges**

6. Add the **Add** method to the **IPhotoSharingContext** interface by using the following information:

   - Return type: **T**, where **T** is any class
   - Parameter: an instance of **T** named **entity**

7. Add the **FindPhotoById** method to the **IPhotoSharingContext** interface by using the following information:

   - Return type: **Photo**
   - Parameter: an integer named **Id**

8. Add the **FindCommentById** method to the **IPhotoSharingContext** interface by using the following information:

   - Return type: **Comment**
   - Parameter: an integer named **Id**

9. Add the **Delete** method to the **IPhotoSharingContext** interface by using the following information:

   - Return type: **T**, where **T** is any class.
   - Parameter: An instance of **T** named **entity**.

10. Ensure that the **PhotoSharingContext** class implements the **IPhotoSharingContent** interface.
11. In the **PhotoSharingContext** class, implement the **Photos** property from the **IPhotoSharingContext** interface and return the **Photos** collection for the **get** method.
12. In the **PhotoSharingContext** class, implement the **Comments** property from the **IPhotoSharingContext** interface and return the **Comments** collection for the **get** method.
13. In the **PhotoSharingContext** class, implement the **SaveChanges** method from the **IPhotoSharingContext** interface and return the results of the **SaveChanges** method.
14. In the **PhotoSharingContext** class, implement the **Add** method from the **IPhotoSharingContext** interface and return a  **Set&lt;T&gt;** collection with **entity** added.
15. In the **PhotoSharingContext** class, implement the **FindPhotoById** method from the **IPhotoSharingContext** interface and return the **Photo** object with requested **Id**.
16. In the **PhotoSharingContext** class, implement the **FindCommentById** method from the **IPhotoSharingContext** interface and return the **Comment** object with requested **Id**.
17. In the **PhotoSharingContext** class, implement the **Delete** method from the **IPhotoSharingContext** interface and return a  **Set&lt;T&gt;** collection with **entity** removed.
18. Save all the changes and build the project.

#### Task 4: Refactor the photo controller to use the repository

1. In the **PhotoController** class, change the declaration of the **context** object so it is an instance of the  **IPhotoSharingContext**. Do not instantiate the **context** object.

2. Add a new constructor to the **PhotoController** class. In the controller, instantiate **context** to be a new  **PhotoSharingContext** object.
3. Add a second constructor to the **PhotoController** class that accepts an **IPhotoSharingContext** implementation named **Context**  as a parameter. In the constructor, instantiate **context** to be the **Context** object.
4. In the PhotoController Display action, replace the call to **context.Photos.Find()** with a similar call to **context.FindPhotoById()**.
5. In the **PhotoController Create** action for the POST verb, replace the call to **context.Photos.Add()** with a similar call to  **context.Add&lt;Photo&gt;**.
6. In the **PhotoController Delete** action, replace the call to **context.Photos.Find()** with a similar call to  **context.FindPhotoById()**.
7. In the **PhotoController DeleteConfirmed** action, replace the call to **context.Photos.Find()** with a similar call to  **context.FindPhotoById()**.
8. In the **PhotoController DeleteConfirmed** action, replace the call to **context.Photos.Remove()** with a similar call to  **context.Delete&lt;Photo&gt;**.
9. In the **PhotoController GetImage** action, replace the call to **context.Photos.Find()** with a similar call to  **context.FindPhotoById()**.
10. Run the application with debugging to ensure that the changes are consistent.

#### Task 5: Refactor the tests to use a mock repository

1. Add a new folder called **Doubles** to the **PhotoSharingTests** project.

2. Add the FakePhotoSharingContext.cs existing file to the Doubles folder from the following location:

   - **Allfiles\20486C\Mod06\Labfiles\Fake Repository\FakePhotoSharingContext.cs**

   >**Note:** This class will be used as a test double for the Entity Framework context.

3. In the PhotoControllerTests.cs file, add **using** statements for the following namespaces:

   - **System.Linq**
   - **PhotoSharingTests.Doubles**

4. In the **Test\_Index\_Return\_View** method, create a new instance of the **FakePhotoSharingContext** class and pass it to the  **PhotoController** constructor.
5. In the **Test\_PhotoGallery\_Model\_Type** method, create a new instance of the **FakePhotoSharingContext** class, add four new **Photo** objects to the class, and then pass them to the **PhotoController** constructor.
6. In the **Test\_GetImage\_Return\_Type** method, create a new instance of the **FakePhotoSharingContext** class.
7. Add four new **Photo** objects to the **context.Photos** collection. Use the following information to add each new **Photo**  object:

   - PhotoId: a unique integer value
   - PhotoFile: a new byte array of length 1
   - ImageMimeType: **image/jpeg**

8. Ensure that the new **FakePhotoSharingContext** object is passed to the **PhotoController** constructor.
9. Run all the tests in the **PhotoSharingTests** project and verify the status of all the tests.

#### Task 6: Add further tests

1. In PhotoControllerTests.cs, add a new test method by using the following information:

   - Annotation: **[TestMethod]**
   - Scope: **public**
   - Return type: **void**
   - Name: **Test\_PhotoGallery\_No\_Parameter**
   - Parameters: None

2. In the **Test\_PhotoGallery\_No\_Parameter** method, create a new instance of the **FakePhotoSharingContext** class, add four new **Photo** objects to the class, and then pass them to the **PhotoController** constructor.
3. Call the **\_PhotoGallery** action and store the **PartialViewResult** in a variable named **result**.
4. Cast the **result.Model** property as an **IEnumerable&lt;Photo&gt;** collection and then check that the number of **Photos** in the collection is 4, which is the same as the number of photos you added to the fake context.
5. In the PhotoControllerTests.cs code window, copy and paste the entire **Test\_PhotoGallery\_No\_Parameter** method. Rename the pasted test method as **Test\_PhotoGallery\_Int\_Parameter**.
6. In the **Test\_Photo\_Gallery\_Int\_Parameter** method, ensure that the call to the **\_PhotoGallery** action passes the integer **3**.
7. Assert that the number of **Photo** objects in the **modelPhotos** collection is **3**, which is the integer you passed to the **\_PhotoGallery** action.
8. Run all the tests in this **PhotoSharingTests** project and verify the status of all tests.

   >**Results** : After completing this exercise, you will be able to add a set of PhotoController tests defined in the PhotoSharingTests project of the Photo Sharing application.

### Exercise 2: Optional—Configuring Exception Handling

#### Scenario

Now that you have developed unit tests for the Photo Sharing application, you need to configure an exception handling strategy for the MVC web application. This would ensure that when exceptions occur in the development phase of the PhotoSharingApplication project, the controller, action, and exception messages are displayed in a custom MVC error view. You also need to implement a placeholder action for the SlideShow action in the PhotoController view. This action will be completed during a later iteration of the project.

Complete this exercise if time permits.

The main tasks for this exercise are as follows:

1. Edit Web.config for exception handling

2. Create a custom error view

3. Configure errors in the PhotoController class

4. Raise errors

#### Task 1: Edit Web.config for exception handling

1. Open the Web.config file in the root level folder of the **PhotoSharingApplication** project.

2. Add the **&lt;customErrors&gt;** element to the **&lt;system.web&gt;** element by using the following information:

   - Parent element: **&lt;system.web&gt;**
   - Element: **&lt;customErrors&gt;**
   - Mode: **On**
   - defaultRedirect: **ErrorPage**

3. Add the **&lt;error&gt;** element to the **&lt;customErrors&gt;** element by using the following information:

   - Parent element: **&lt;customErrors&gt;**
   - Element: **&lt;error&gt;**
   - statusCode: **500**
   - redirect: **Error.html**

4. Add a new HTML page to the **PhotoSharingApplication** project by using the following information:

   - Template: **HTML Page**
   - Name: **Error.html**

5. In the **Error.html** file, set the contents of the **TITLE** element to **Error**.
6. Add content to the **Error.html** file to explain the error to users.

#### Task 2: Create a custom error view

1. Add a new view to the **Shared** folder by using the following information:

   - Name of the view: **Error**
   - View type: **Not strongly typed**
   - Layout or master page: **None**

2. In the **Error.cshtml** file, set the content of the **TITLE** element to **Custom Error**.
3. Set the **@model** for the **Error.cshtml** to **System.Web.Mvc.HandleErrorInfo**.
4. In the **DIV** element, render an **H1** element by using the following information:

   - Content: **MVC Error**

5. In the **DIV** element, render the **ControllerName** property of the **Model** object.
6. In the **DIV** element, render the **ActionName** property of the **Model** object.
7. In the **DIV** element, render the **Exception.Message** property of the **Model** object.
8. Save all the changes made to the **Error.cshtml** file.

#### Task 3: Configure errors in the PhotoController class

1. Modify the **PhotoController** class to send errors to the **Error.cshtml** view by using the following information:

   - Class: **PhotoController**
   - Annotation: **HandleError**
   - View: **Error**

2. Add a new action to the **PhotoController** class by using the following information:

   - Scope: **public**
   - Return type: **ActionResult**
   - Name: **SlideShow**
   - Parameters: **None**

3. In the new action, throw an exception by using the following information:

   - Type: **NotImplmentedException**
   - Message: **The SlideShow action is not yet ready**

#### Task 4: Raise errors

1. Start debugging and display **Sample Photo 5**.
2. In the **Microsoft Edge** window, request the relative URL and view the error details.

   - URL: **/Photo/Display/malformedId**

3. In the **Microsoft Edge** window, request the relative URL.

   - URL: **/Photo/SlideShow**

4. Use the IntelliTrace pane to investigate the exception.
5. Stop debugging and close Visual Studio.

  >**Results** : After completing this exercise, you will be able to:  
  >    - Configure a custom error handling strategy for an MVC application.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
