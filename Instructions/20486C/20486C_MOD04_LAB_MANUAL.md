# Module 4: Developing ASP.NET MVC 5 Controllers

# Lab: Developing ASP.NET MVC 5 Controllers

#### Scenario

You have been asked to add a controller to the photo sharing application that corresponds to the Photo model class that you have created in an earlier module. The controller should include actions that respond when users upload photos, list all photos, display a single photo, and delete photos from the application. You should also add an action that returns the photo as a .jpg file to show on a webpage.

The members of your development team are new to ASP.NET MVC and they find the use of controller actions confusing. Therefore, you need to help them by adding a component that displays action parameters in the Visual Studio Output window whenever an action runs. You will add an action filter to achieve this.

>**Note:** The controllers and views that you have added in Lab 2 were to test your new model classes. They have been removed from the project to create the actual controllers. You will create temporary views to test these controllers at the end of this lab.

#### Objectives

After completing this lab, you will be able to:

- Add an MVC controller to a web application.
- Write actions in an MVC controller that respond to user operations such as create, index, display, and delete.
- Write action filters that run code for multiple actions.

#### Lab Setup

Estimated Time: **60 minutes**


### Exercise 1: Adding an MVC Controller and Writing the Actions

#### Scenario

In this exercise, you will create the MVC controller that handles photo operations. You will also add the following actions:

- _Index_. This action gets a list of all the Photo objects and passes the list to the Index view for display.
- _Display_.This action takes an Id to find a single Photo object. It passes the Photo to the Display view for display.
- _Create (GET)_.This action creates a new Photo object and passes it to the Create view, which displays a form that the visitor can use to upload a photo and describe it.
- _Create (POST)_. This action receives a Photo object from the Create view and saves the details to the database.
- _Delete (GET)_.This action displays a Photo object and requests confirmation from the user to delete the Photo object.
- _DeleteConfirmed (POST)_.This action deletes a Photo object after confirmation.
- _GetImage:_ This action returns the photo image from the database as a JPEG file. This method is called by multiple views to display the image.

The main tasks for this exercise are as follows:

1. Create a photo controller.

2. Create the Index action

3. Create the Display action.

4. Write the Create actions for GET and POST HTTP verbs.

5. Create the Delete actions for GET and POST HTTP verbs.

6. Create the GetImage action.

#### Task 1: Create a photo controller.

1. Open the PhotoSharingApplication.sln file from the following location:
2. File path: **Allfiles\20486C\Mod04\Labfiles\PhotoSharingApplication_4_begin**
3. Create a new controller for handling **photo** objects by using the following information:

   - Controller name: **PhotoController**
   - Template: **MVC 5 controller - Empty**

4. Add **using** statements to the controller for the following namespaces:

   - **System.Globalization**
   - **PhotoSharingApplication.Models**

5. In the PhotoController class, create a new private object by using the following information:

   - Scope: **private**
   - Class: **PhotoSharingContext**
   - Name: **context**

   Instantiate the new object by calling the **PhotoSharingContext** constructor.

#### Task 2: Create the Index action

- Edit the code in the **Index** action by using the following information:

   - Return class: **View**
   - View name: **Index**
   - Model: **context.Photos.ToList()**

#### Task 3: Create the Display action.

1. Add a method for the **Display** action by using the following information:

   - Scope: **public**
   - Return Type: **ActionResult**
   - Name: **Display**
   - Parameters: One integer called **id**

2. Within the **Display** action code block, add code to find a single **photo** object from its **Id**.
3. If no photo with the right Id is found, return the **HttpNotFound** value.
4. If a photo with the right Id is found, pass it to a view called **Display**.

#### Task 4: Write the Create actions for GET and POST HTTP verbs

1. Add a method for the **Create** action by using the following information:

   - Scope: **public**
   - Return type: **ActionResult**
   - Name: **Create**

2. Add code to the **Create** action that creates a new Photo and sets its **CreatedDate** property to today&#39;s date.
3. Pass the new **Photo** to a view called **Create**.
4. Add another method for the **Create** action by using the following information:

   - HTTP verb: **HTTP Post**
   - Scope: **public**
   - Return type: **ActionResult**
   - Name: **Create**
   - First parameter: a **Photo** object called **photo**.
   - Second parameter: an **HttpPostedFileBase** object called **image**.

5. Add code to the **Create** action that sets the **photo.CreatedDate** property to today&#39;s date.
6. If the **ModelState** is not valid, pass the **photo** object to the **Create** view. Else, if the image parameter is not null, set the **photo.ImageMimeType** property to the value of **image.ContentType** , set the **photo.PhotoFile** property to be a new byte array of length, **image.ContentLength** , and then save the file that the user posted to the **photo.PhotoFile** property by using the **image.InputStream.Read()** method.
7. Add the **photo** object to the context, save the changes, and then redirect to the **Index** action.

#### Task 5: Create the Delete actions for GET and POST HTTP verbs

1. Add a method for the **Delete** action by using the following information:

   - Scope: **public**
   - Return type: **ActionResult**
   - Name: **Delete**
   - Parameter: an integer called **id**

2. In the **Delete** action, add code to find a single **photo** object from its **id**.
3. If no Photo with the right **id** is found, return the **HttpNotFound** value.
4. If a Photo with the right **id** is found, pass it to a view called **Delete**.
5. Add a method called **DeleteConfirmed** by using the following information:

   - HTTP verb: **HTTP Post**
   - ActionName: **Delete**
   - Scope: **public**
   - Return type: **ActionResult**
   - Name: **DeleteConfirmed**
   - Parameter: an integer called **id**

6. Find the correct **photo** object from the **context** by using the **id** parameter.
7. Remove the **photo** object from the **context**, save your changes and redirect to the **Index** action.

#### Task 6: Create the GetImage action

1. Add a method for the **GetImage** action by using the following information:

   - Scope: **public**
   - Return type: **FileContentResult**
   - Name: **GetImage**
   - Parameter: an integer called **id**

2. Find the correct **photo** object from the **context** by using the **id** parameter.
3. If the **photo** object is not null, return a **File** result constructed from the **photo.PhotoFile** and **photo.ImageMimeType** properties, else return the **null** value.
4. Save the file.

>**Results** : After completing this exercise, you will be able to create an MVC controller that implements common actions for the Photo model class in the Photo Sharing application.

### Exercise 2: Optional—Writing the Action Filters in a Controller

#### Scenario

Your development team is new to MVC and is having difficulty in passing the right parameters to controllers and actions. You need to implement a component that displays the controller names, action names, parameter names, and values in the Visual Studio Output window to help with this problem. In this exercise, you will create an action filter for this purpose.

Complete this exercise if time permits.

The main tasks for this exercise are as follows:

1. Add an action filter class.

2. Add a logValues method to the action filter class.

3. Add a handler for the OnActionExecuting event.

4. Register the Action Filter with the Photo Controller.

#### Task 1: Add an action filter class

1. Create a new class for the action filter by using the following information:

   - Name: **ValueReporter**
   - Folder: **Controllers**

2. Add **using** statements to the controller for the following namespaces:

   - **System.Diagnostics**
   - **System.Web.Mvc**
   - **System.Web.Routing**

3. Ensure that the **ValueReporter** class inherits from the **ActionFilterAttribute** class.

#### Task 2: Add a logValues method to the action filter class

1. Add a method to the **ValueReporter** class by using the following information:

   - Scope: **private**
   - Return type: **void**
   - Name: **logValues**
   - Parameter: a **RouteData** object called **routeData**.

2. Within the **logValues** method, call the **Debug.WriteLine** method to send the name of the controller and action to the Visual Studio Output window. For the category, use the string, &quot;Action Values&quot;.
3. Within the **logValues** method, create a **foreach** loop that loops through the **var** items in **routeData.Values**.
4. In the **foreach** loop, call the **Debug.WriteLine** method to send the key name and value to Visual Studio Output window.

#### Task 3: Add a handler for the OnActionExecuting event.

1. In the **ValueReporter** action filter, override the **OnActionExecuting** event handler.
2. Delete the **base.OnActionExecuting** code block
3. In the **OnActionExecuting** event handler, call the **logValues** method, and pass the **filterContext.RouteData** object.
4. Save the file.

#### Task 4: Register the Action Filter with the Photo Controller.

1. Open the **PhotoController** class and add the **ValueReporter** action filter to the **PhotoController** class.
2. Save the file.

>**Results** : After completing this exercise, you should have created an action filter class that logs the details of actions, controllers, and parameters to the Visual Studio Output window, whenever an action is called.

### Exercise 3: Using the Photo Controller

#### Scenario

In this exercise, you will:

- Create a temporary index and display views by using the scaffold code that is built into the Visual Studio MVC application template.
- Use the views to test controllers, actions, and action filters, and run the Photo Sharing application.

The main tasks for this exercise are as follows:

1. Create the Index and Display views.

2. Use the GetImage action in the Display view.

3. Run the application and display a photo.

#### Task 1: Create the Index and Display views

1. Compile the PhotoSharingApplication project to build the solution.
2. Add a new view to the **Index** action method of the **PhotoController** class by using the following information:

   - Folder: **Views/Photo**
   - Name: **Index**
   - Model class: **Photo (PhotoSharingApplication.Models)**
   - Scaffold template: **List**

3. Add a new view to the **Display** action method of the **PhotoController** class by using the following information:

   - Folder: **Views/Photo**
   - Name: **Display**
   - Model class: **Photo(PhotoSharingapplication.Models)**
   - Scaffold template: **Details**
4. Locate the folowing code:
```@Html.ActionLink("Details", "Details", new {id=item.PhotoId})```
5. replace the code you located with the following code
```@Html.ActionLink("Display", "Display", new {id=item.PhotoId})```

#### Task 2: Use the GetImage action in the Display view

1. In the Display.cshtml code window, after the code that displays the **model.Title** property, add a code that runs if the **Model.PhotoFile** property is not **null**.
2. Within the **if** code block, render an **&lt;img&gt;** tag. Use the following information:

   - Tag: **&lt;img&gt;**
   - Width: **800px**
   - Source: **Blank**

3. In the **src** attribute of the &lt;img&gt; tag, add a call to the **Url.Action** helper by using the following information:

   - Controller: **Photo**
   - Action: **GetImage**
   - Parameters: **Model.PhotoId**

4. Save the file.
5. Build the solution.

#### Task 3: Run the application and display a photo.

1. Start debugging the application and access the following relative path:

   - Path: **/photo/index**

2. If you completed Exercise 2, in the **Output** pane of the **PhotoSharingApplication - Microsoft Visual Studio** window, locate the last entry in the **Action Values** category to verify whether there are any calls to the **Display** and the **GetImage** actions.
3. Display an image.
4. If you completed Exercise 2, in the **Output** pane of the **PhotoSharingApplication - Microsoft Visual Studio** window, locate the last entry in the **Action Values** category to verify whether there are any calls to the **Display** and the **GetImage** actions.
5. Stop debugging and close Microsoft Visual Studio.

>**Results** : After completing this exercise, you should have created an MVC application with views that you can use to test controllers, actions, and action filters.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
