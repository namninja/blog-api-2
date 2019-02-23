"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/blogs-api";
exports.PORT = process.env.PORT || 8080;
