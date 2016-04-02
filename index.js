// scarlet - logger

var fs = require("fs"),
	color = require("colors"),
	moment = require("moment");

var logfiles = {};

function colour(level) {
	if (level == "INFO")
		return level.cyan;
	else if (level == "WARN")
		return level.yellow;
	else if (level == "ERR")
		return level.red.bold;
	else return level.grey;
}

function consoleLog(name, level, msg) {
	console.log("[" + name + " " + colour(level) + "@" + moment() + "] " + msg);
}

function file(fd, name, level, msg) {
	fs.writeFile(fd, "[" + name + " " + level + "@" + moment() + "] " + msg + "\n", function(err) {
		if (err) consoleLog(name, "ERR", err);
	});
}

function Logger(name, fileOn) {
	this.name = name;

	if (fileOn)
		this.fd = fs.openSync("./log/" + name + ".txt", "a");
	else this.fd = null;

	this.log = function(level, msg) {
		consoleLog(this.name, level, msg);

		if (this.fd != null)
			file(this.fd, this.name, level, msg);
	}

	this.info = function(msg) {
		this.log("INFO", msg);
	}

	this.warn = function(msg) {
		this.log("WARN", msg);
	}

	this.err = function(msg) {
		this.log("ERR", msg);
	}
}

var scarlet = {
	"get": function(name, fileOn) {
		if (logfiles[name] != null)
			return logfiles[name];

		logfiles[name] = new Logger(name, fileOn);

		return logfiles[name];
	},
	"console": consoleLog
}

module.exports = scarlet;