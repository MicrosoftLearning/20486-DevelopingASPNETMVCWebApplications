## Module 3: Developing ASP.NET MVC 5 Models

## Lab: Developing ASP.NET MVC 5 Models

#### Scenario

You are planning to create and code an MVC model that implements your plan for photos and comments in the Adventure Works photo sharing application. The model must store data in a Microsoft Azure SQL database and include properties that describe photos, comments, and their content. The model must enable the application to store uploaded photos, edit their properties, and delete them in response to user requests.

#### Objectives

After completing this lab, you will be able to:

- Create a new ASP.NET MVC 5 project in Visual Studio 2017.
- Add a new model to the ASP.NET MVC 5 web application and add properties to the model.
- Use display and edit data annotations in the MVC model to assign property attributes to views and controllers.
- Use Visual Studio to create a new Microsoft Azure SQL database and connect to the database.
- Add Entity Framework code to the model classes in the MVC model.
- Use display and edit data annotations in the MVC model to assign property attributes to views and controllers.

#### Lab Setup

Estimated Time: **30 minutes**

### Exercise 1: Creating an MVC Project and Adding a Model

#### Scenario

In this exercise, you will:

- Create a new MVC 5 web application in Visual Studio 2017.
- Add model classes to the web application.

The main tasks for this exercise are as follows:

1. Create a new MVC project.

2. Add a new MVC model.

#### Task 1: Create a new MVC project.

1. Open Visual Studio 2017 and create a new ASP.NET Web Application by using the following information:

    - Name: **PhotoSharingApplication**
    - Location: **Allfiles/20486C/Mod03/Labfiles**
    - Solution name: **PhotoSharingApplication**
    - Create directory for solution: True
    - Project template: **MVC**

#### Task 2: Add a new MVC model.

1. Add a new model class to the **PhotoSharingApplication** project by using the following information:

   - Class name: **Photo**

2. Add another model class to the **PhotoSharingApplication** project by using the following information:

   - Class name: **Comment**

 >**Results**: After completing this exercise, you should have successfully created an MVC 5 web application and added model classes to the web application.

### Exercise 2: Adding Properties to MVC Models

#### Scenario

In this exercise, you will:

1. Add properties to the Photo and the Comment model classes.
2. Implement a relationship between model classes.

The main tasks for this exercise are as follows:

1. Add properties to the Photo model class.

2. Add properties to the Comment model class.

3. Implement a relationship between model classes.

#### Task 1: Add properties to the Photo model class.

1. Add a primary key property to the Photo model class by using the following information:

   - Scope: **public**
   - Property name: **PhotoId**
   - Data type: **integer**
   - Access: **Read and write**

2. Add a title property to the Photo model class by using the following information:

   - Scope: **public**
   - Property name: **Title**
   - Data type: **string**
   - Access: **Read and write**

3. Add an image property to the **Photo** model class and store the MIME type of image by using the following information:

   - Scope: **public**
   - Property names: **PhotoFile**, **ImageMimeType**
   - Data type for the image: **byte []**
   - Data type for MIME type: **string**
   - Access: **Read and write**

4. Add a description property to the **Photo** model class by using the following information:

   - Scope: **public**
   - Property name: **Description**
   - Data type: **String**
   - Access: **Read and write**

5. Add a date property to the **Photo** model class by using the following information:

   - Scope: **public**
   - Property name: **CreatedDate**
   - Data type: **DateTime**
   - Access: **Read and write**

6. Add a user name property to the **Photo** model class by using the following information:

   - Scope: **public**
   - Property name: **UserName**
   - Data type: **string**
   - Access: **Read and write**

#### Task 2: Add properties to the Comment model class.

1. Add a primary key to the **Comment** model class by using the following information:

   - Scope: **public**
   - Property name: **CommentId**
   - Data type: **integer**
   - Access: **Read and write**

2. Add a **PhotoId** property to the **Comment** model class by using the following information:

   - Scope: **public**
   - Property name: **PhotoId**
   - Data type: **integer**
   - Access: **Read and write**

3. Add a **UserName** property to the **Comment** model class by using the following information:

   - Scope: **public**
   - Property name: **UserName**
   - Data type: **string**
   - Access: **Read and write**

4. Add a **Subject** property to the **Comment** model class by using the following information:

   - Scope: **public**
   - Property name: **Subject**
   - Data type: **string**
   - Access: **Read and write**

5. Add a **Body** text property to the **Comment** model class by using the following information:

   - Scope: **public**
   - Property name: **Body**
   - Data type: **string**
   - Access: **Read and write**

#### Task 3: Implement a relationship between model classes.

1. Add a new property to the **Photo** model class to retrieve comments for a given photo by using the following information:

   - Scope: **public**
   - Property name: **Comments**
   - Data type: a collection of **Comments**
   - Access : **Read and write**
   - Include the **virtual** keyword

2. Add a new property to the **Comment** model class to retrieve the photo for a given comment by using the following information:

   - Scope: **public**
   - Property name: **Photo**
   - Property type: **Photo**
   - Access: **Read and write**
   - Include the **virtual** keyword

 >**Results**: After completing this exercise, you should have successfully added properties to classes for describing them to the MVC runtime and implemented a one-to-many relationship between classes.

### Exercise 3: Using Data Annotations in MVC Models

#### Scenario

In this exercise, you will:

- Add data annotations to the properties to help MVC web application render them in views and validate user input.

The main tasks for this exercise are as follows:

1. Add display and edit data annotations to the model.

2. Add validation data annotations to the model.

#### Task 1: Add display and edit data annotations to the model.

1. Add a display data annotation to the **Photo** model class to ensure that the **PhotoFile** property is displayed with the name, **Picture**.
2. Add an edit data annotation to the **Photo** model class that ensures the **Description** property editor is a multiline text box.
3. Add the following data annotations to the **Photo** model class to describe the **CreatedDate** property:

   - Data type: **DateTime**
   - Display name: **Created Date**
   - Display format: **{0:MM/dd/yy}**

4. Add an edit data annotation to the **Comment** model class that ensures that the **Body** property editor is a multiline text box.

#### Task 2: Add validation data annotations to the model.

1. Add a validation data annotation to the **Photo** model class to ensure that the users complete the Title field.
2. Add validation data annotations to the **Comment** model class to ensure that the users complete the **Subject** text box and type a string with a length shorter than 250 characters.

 >**Results**: After completing this exercise, you should have successfully added property descriptions and data annotations to the two model classes in the MVC web application.

### Exercise 4: Creating a New Microsoft Azure SQL Database

#### Scenario

In this exercise, you will:

- Add Entity Framework code to the Photo Sharing application in code-first mode.
- Create a new SQL database in Microsoft Azure.
- Use the SQL database to create a connection string in the application.

The main tasks for this exercise are as follows:

1. Add an Entity Framework Context to the model.

2. Add an Entity Framework Initializer.

3. Create a Microsoft Azure SQL database and obtain a connection string.

#### Task 1: Add an Entity Framework Context to the model.

1. Use the NuGet Package Manager to add Entity Framework version 6.1.3.0 to the application.

2. Add a new class named **PhotoSharingContext** to the **Models** folder and ensure that the new class inherits the **System.Data.Entity.DbContext** class.

3. Add public **DbSet** properties to Photos and Comments to enable Entity Framework to create database tables called Photos and Comments.

#### Task 2: Add an Entity Framework Initializer.

1. Add a new class named **PhotoSharingInitializer** to the **Models** folder and ensure that the new class inherits the **DropCreateDatabaseAlways&lt;PhotoSharingContext&gt;** class.
2. Open the getFileBytes.txt file from the following location and add all the text of the file as a new method to the PhotoSharingInitializer class:

   - File path: **Allfiles/20486C/Mod03/Labfiles/CodeSnippets**

3. Override the **Seed** method in the **PhotoSharingInitializer** class.
4. Create a new list of **Photo** objects in the **Seed** method. The list should contain one photo object with the following properties:

   - Title: **Test Photo**
   - Description: _&lt;A description of your choice&gt;_
   - UserName: **NaokiSato**
   - PhotoFile: **getFileBytes(&quot;\\\Images\\\flower.jpg&quot;)**
   - ImageMimeType: **image/jpeg**
   - CreatedDate: &lt;_Today&#39;s date&gt;_

5. Add each **photo** object in the **photos** list to the Entity Framework context, and then save the changes to the context.
6. Create a new list of Comment objects in the **Seed** method. The list should contain one **Comment** object with the following properties:

   - PhotoId: **1**
   - UserName: **NaokiSato**
   - Subject: **Test Comment**
   - Body: **This comment should appear in photo 1**

7. Add the comment list to the Entity Framework context and save the comment to the database.
8. Open **Global.asax** and add a line of code to the **Application_Start** method that calls **Database.SetInitializer**, passing a new **PhotoSharingInitializer** object. Also add the following namespaces:

   - **using System.Data.Entity;**
   - **using PhotoSharingApplication.Models;**

#### Task 3: Add a controller and views.

1. Add a new controller to the **PhotoSharingApplication** project by using the following information:

   - Name **: PhotoController**
   - Template: **MVC 5 Controller with views, using Entity Framework**
   - Model class: **Photo (PhotoSharingApplication.Models)**
   - Data context class : **PhotoSharingContext (PhotoSharingApplication.Models)**

#### Task 4: Create a Microsoft Azure SQL database and obtain a connection string.

1. Use the NuGet Package Manager to update Entity Framework to version 6.1.3.

2. Add a parameterless constructor to the **PhotoSharingContext** class. In the constructor set the value of the **Database.CommandTimeout** property to **180**.

3. Sign in to the Microsoft Azure portal by using the portal address: **https://portal.azure.com/**

4. Create a new database server and a new database by using the following information:

   - Database name: **PhotoSharingDB**
   - Database server: **Create a new server**
   - Login name: &lt;_your first name&gt;_
   - Login password: **Pa$$w0rd**
   - Login password confirmation: **Pa$$w0rd**
   - Region: &lt;_a region close to you&gt;_

5. In the list of allowed IP addresses for the **PhotoSharingDB** database, add the following IP address ranges:

   - Rule name: **First Address Range**
   - Start IP Address: _&lt;first address in range&gt;_
   - End IP Address: _&lt;last address in range&gt;_

6. Obtain the connection string for the **PhotoSharingDB** database and add it to the **Web.config** file.
7. Build the Photo Sharing application.

 >**Results**: After completing this exercise, you should have successfully created an MVC application that uses Microsoft Azure SQL Database as its data store.

### Exercise 5: Testing the Model and Database

#### Scenario

In this exercise, you will:

- Run the web application.

The main tasks for this exercise are as follows:

1. Add an image and run the application.

#### Task 1: Add an image and run the application.

1. Create a new top-level folder, and copy an image to the new folder by using the following information:

   - New folder name: **Images**
   - Image to be copied: **flower.JPG**
   - Location of the image: **Allfiles/20486C/Mod03/Labfiles/Images**

2. Run the application by debugging, and access the following relative path:

   - **/photo/index**

 >**Results**: After completing this exercise, you should have successfully added an image to an MVC web application and tested the application by displaying data from a Microsoft Azure SQL database.

©2017 Microsoft Corporation. All rights reserved.

The text in this document is available under the  [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/legalcode), additional terms may apply. All other content contained in this document (including, without limitation, trademarks, logos, images, etc.) are  **not**  included within the Creative Commons license grant. This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes.

This document is provided &quot;as-is.&quot; Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred. Microsoft makes no warranties, express or implied, with respect to the information provided here.
