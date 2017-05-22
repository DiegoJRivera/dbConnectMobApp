/**************************************************************************************************************************************************************
Session 11 Local Storage and JSON Format Exercises
Author: Diego Rivera
08/05/2017
***************************************************************************************************************************************************************/

var createTableSQL = "CREATE TABLE IF NOT EXISTS tblFooty (fldId INTEGER PRIMARY KEY AUTOINCREMENT, fldFirstname TEXT, fldLastname TEXT, fldJumper NUMBER);";
var insertSQL = "INSERT into tblFooty (fldFirstname, fldLastname, fldJumper) VALUES (?,?,?);";
var showSQL = "SELECT * FROM tblFooty;";
var deleteSQL = "DELETE from tblFooty WHERE fldId=?;";
var deleteAllSQL = "DELETE from tblFooty;";
var findRecordSQL = " SELECT * FROM tblFooty WHERE fldId = ?;";
var updateRecordSQL = "UPDATE tblFooty SET fldFirstname=?, fldLastname=?, fldJumper=? WHERE fldId=?;";

var db = null;

//wait to cordova load
$(document).ready(function(){
    document.addEventListener("deviceready", onDeviceReady(), false);
});

function onDeviceReady()
{
    console.log("In device ready");

    try
    {
        if(!window.openDatabase)
            alert("This device does not support databases");
        else
        {
            console.log("About to open database");

            var shortName = "Footy";
            var version = "";
            var display = "Footy Players";
            var maxSize = 1000;

            db = window.openDatabase(shortName, version, display, maxSize);
            console.log("Opened Database");
            /* 
            Create a table and insert a few records
            1. sql function
            2. if an errorsoccurs in sql (optional)
            3. if all goes well in sql (optional)
            */
            db.transaction(populateDB, onError, showRecords);
        }
    }
    catch(err)
    {
        console.log("Error: " + err);
    }
}

function populateDB(trans)
{
    db.transaction(function(trans){
        //created table
        trans.executeSql(createTableSQL, []);
        console.log("Table Created");
        //insert some records
        trans.executeSql(insertSQL, ["Mati", "Fernandez", "14"]);
        trans.executeSql(insertSQL, ["Gary", "Medel", "17"]);
        console.log("Inserted Some Records");
    });
}

function showRecords(trans)
{
    console.log("In show records");

    db.transaction(function(trans){
        
        trans.executeSql(showSQL, [], function(trans, result){
            
            var str = "";

            if(result.rows.length == 0)
                str = "<em>There are no records to display!</em>"
            else
            {
                str += "<table border='1' width='80%'>";

                var noOfRows = result.rows.length;

                for(var i = 0, row = null; i < noOfRows; i++)
                {
                    //assign row to a variable
                    row = result.rows.item(i);
                    //process each record
                    str += "<tr>";
                    //"<td><a href='#' onClick='loadRecord();'>Edit</a></td>"
                    str += "<td><a href='#' onClick='loadRecord(" + row['fldId'] + ");'>Edit</a></td>";
                    str += "<td><a href='#' onClick='deleteRecord(" + row['fldId'] + ");'>Delete</a></td>";

                    str += "<td>" + row['fldFirstname'] + "</td>";
                    str += "<td>" + row['fldLastname'] + "</td>";
                    str += "<td>" + row['fldJumper'] + "</td>";
                    str += "</tr>";
                }
                str += "</table>";
            }
            $("#results").html(str);
        });
    });
}

function insertRecord()
{
    console.log("Inserting record");
    //write separate if statements
    if($("#txtFirst, txtLast, txtJumper").val() == "")
    {
        alert("You must fill in All fields");
        return false;
    }
    else
    {
        db.transaction(function(trans){
            trans.executeSql(insertSQL, [$('#txtFirst').val(), $('#txtLast').val(), $('#txtJumper').val()], showRecords, onError);
        });
        return true;
    }
}

function deleteAllRecord()
{
    console.log("Deleting All Records");
    var q = confirm("Do you want to delete ALL records?");

    if(q)
    {
        db.transaction(function(trans){
            trans.executeSql(deleteAllSQL, [], showRecords, onError);
        });
        return true;
    }
    else
        return false;
}

function deleteRecord(id)
{
    console.log("About to delete this record");
    var q = confirm("Do you want to delete this records?");

    if(q)
    {
        db.transaction(function(trans){
            trans.executeSql(deleteSQL, [id], showRecords, onError);
        });
        return true;
    }
    else
        return false;
}

function loadRecord(id)
{
    console.log("Loading record");

    db.transaction(function(trans){
        trans.executeSql(findRecordSQL, [id], function(trans, result){

            var rec = result.rows.item(0);

            $("#txtId").val(rec['fldId']);
            $("#txtFirst").val(rec['fldFirstname']);
            $("#txtLast").val(rec['fldLastname']);
            $("#txtJumper").val(rec['fldJumper']);
        });
    });
}

function updateRecord()
{
    db.transaction(function(trans){
        trans.executeSql(updateRecordSQL, [$('#txtFirst').val(), $('#txtLast').val(), $('#txtJumper').val(), $('#txtId').val()], showRecords, onError);        
        });
}

function onError(err)
{
    switch(err.code)
    {
        case 0: alert("Non database error: " + err.message);
            break;

        case 1: alert("Some database error: " + err.message);
            break;

        case 2: alert("Wrong database version: " + err.message);
            break;

        case 3: alert("Data set too large to return from query: " + err.message);
            break;

        case 4: alert("Storage limit exceeded: " + err.message);
            break;

        case 5: alert("Lock contention error: " + err.message);
            break;

        case 6: alert("Constraint failure: " + err.message);
            break;

        default: alert("Error: " + err.code + " " + err.message);
    }
}