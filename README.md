VScode extension, inserts log/printf or any selected string on new line

Command to use: `printLoggerShortcut.insertPrint`


Can be customized:

```json
 "printLoggerShortcut.logPrefix": "string", 
```

```json
"printLoggerShortcut.loggerMap": {
  "typescript": "console.log(\"${label}\", ${value});",
  "elixir": "IO.puts(\"${label}: #{${value}}\")"
}
```

To install locally `make install`
