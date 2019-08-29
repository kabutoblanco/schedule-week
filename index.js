var pressed = false;
var interval = 0;
var schedules = [];
var daysArray = [];
var hoursArray = [];

$(document).ready(function () {
    $(".schedule-body").on("mousedown", function () { pressed = true; });
    $(".schedule-body").on("mouseup", function () { pressed = false; });
    $(".schedule-body").on("mouseleave", function () { pressed = false; });
    $(".schedule").on("mousedown", select);
    $(".schedule").on("mouseover", select);
});

function select(event) {
    const schedule = $(event.target);
    if (pressed || event.type === "mousedown") {
        const i = event.target.parentElement.sectionRowIndex;
        const j = event.currentTarget.cellIndex - 1;
        const untilDateNeto = parseInt(hoursArray[i].split(":")[0]) + (parseInt(hoursArray[i].split(":")[1]) + interval) / 60;
        var minutes = (untilDateNeto - Math.trunc(untilDateNeto)) * 60;
        var hours = Math.trunc(untilDateNeto);
        var untilHour = parseDate(hours, minutes);
        const scheduleIJ = { fromHour: hoursArray[i], untilHour: untilHour, day: daysArray[j] };
        if (schedule.hasClass("red")) {
            $(event.target).removeClass("red");
            function equalsSchedule(element) {
                if (element.fromHour === scheduleIJ.fromHour && element.untilHour === scheduleIJ.untilHour && element.day === scheduleIJ.day) {
                    return element;
                }
            }
            schedules.splice(schedules.findIndex(equalsSchedule), 1);
        } else {
            $(event.target).addClass("red");
            schedules.push(scheduleIJ);
        }
        console.log(schedules);
    }
}

function customTag(tagName, fn) {
    document.createElement(tagName);
    const tagInstances = document.getElementsByTagName(tagName);
    for (var i = 0; i < tagInstances.length; i++) {
        fn(tagInstances[i]);
    }
}

function schedule(element) {
    const nodeScheduleDiv = document.createElement("div");
    nodeScheduleDiv.className += "schedule-container";

    const nodeTitleDiv = document.createElement("div");
    nodeTitleDiv.className += "schedule-title";
    nodeScheduleDiv.appendChild(nodeTitleDiv);

    const title = element.attributes.title.value;
    const nodeTitle = document.createElement("span");
    const nodeTitleText = document.createTextNode(title);
    nodeTitle.appendChild(nodeTitleText);
    nodeTitleDiv.appendChild(nodeTitle);

    const nodeTableDiv = document.createElement("div");
    const nodeTableResponsive = document.createElement("div");
    nodeTableDiv.className += "schedule-table";
    nodeTableResponsive.className += "table-responsive";
    interval = parseInt(element.attributes.interval.value);
    const fromDate = element.attributes.minHour.value;
    const untilDate = element.attributes.maxHour.value;
    const intervalNeto = interval / 60;
    const fromDateNeto = parseInt(fromDate.split(":")[0]) + parseInt(fromDate.split(":")[1]) / 60;
    const untilDateNeto = parseInt(untilDate.split(":")[0]) + parseInt(untilDate.split(":")[1]) / 60;
    const deltaDate = untilDateNeto - fromDateNeto;
    const vectorDays = ["Hora", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    daysArray = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    if (deltaDate % intervalNeto == 0) {
        const deltaRow = deltaDate / (interval / 60);
        //Struct General
        const nodeTable = document.createElement("table");
        const nodeThead = document.createElement("thead");
        const nodeBody = document.createElement("tbody");
        nodeTable.appendChild(nodeThead);
        nodeTable.appendChild(nodeBody);
        nodeTableDiv.appendChild(nodeTable);
        nodeBody.className += "schedule-body";
        // - - - - - - - - - -
        const nodeTr = document.createElement("tr");
        const nodeTh = document.createElement("th");
        const nodeTd = document.createElement("td");
        const nodeSpan = document.createElement("span");
        //Header Table       
        nodeThead.appendChild(nodeTr.cloneNode());
        for (var i = 0; i < vectorDays.length; i++) {
            nodeThead.lastChild.appendChild(nodeTh.cloneNode());
            nodeThead.lastChild.lastChild.appendChild(document.createTextNode(vectorDays[i]));
        }
        // - - - - - - - - - -
        //Schedules   
        for (var i = 0, intervalVar = fromDateNeto; i < deltaRow; i++ , intervalVar = intervalVar + intervalNeto) {
            var minutes = (intervalVar - Math.trunc(intervalVar)) * 60;
            var hours = Math.trunc(intervalVar);
            var scheduleNeto = parseDate(hours, minutes);
            nodeBody.appendChild(nodeTr.cloneNode());
            nodeBody.lastChild.appendChild(nodeTd.cloneNode());
            nodeBody.lastChild.lastChild.appendChild(nodeSpan.cloneNode());
            nodeBody.lastChild.lastChild.className += "non-select";
            nodeBody.lastChild.lastChild.lastChild.appendChild(document.createTextNode(scheduleNeto));
            hoursArray.push(scheduleNeto);
            for (var j = 0; j < vectorDays.length - 1; j++) {
                nodeBody.lastChild.appendChild(nodeTd.cloneNode());
                nodeBody.lastChild.lastChild.appendChild(document.createTextNode(""));
                nodeBody.lastChild.lastChild.className += "schedule";
            }
        }
        nodeTableResponsive.appendChild(nodeTableDiv);
        nodeScheduleDiv.appendChild(nodeTableResponsive);
        element.appendChild(nodeScheduleDiv);
        // - - - - - - - - - -
    } else {
        throw new ExceptionInterval();
    }
}

class ExceptionInterval {
    constructor() {
        this.message = "Interval out range values";
        this.name = "Exception interval";
    }
}

function parseDate(hours, minutes) {
    if ((minutes + "").length < 2) {
        minutes = "0" + minutes;
    }
    if ((hours + "").length < 2) {
        hours = "0" + hours;
    }
    return hours + ":" + minutes;
}

customTag("schedule", schedule);