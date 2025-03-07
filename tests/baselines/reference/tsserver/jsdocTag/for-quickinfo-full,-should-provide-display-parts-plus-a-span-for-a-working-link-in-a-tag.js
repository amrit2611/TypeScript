currentDirectory:: / useCaseSensitiveFileNames: false
Info seq  [hh:mm:ss:mss] Provided types map file "/a/lib/typesMap.json" doesn't exist
Before request
//// [/a/someFile1.js]
class C { }
/** @wat {@link C} */
var x = 1

//// [/a/tsconfig.json]
{
"compilerOptions": {
"checkJs": true,
"noEmit": true
}
"files": ["someFile1.js"]
}



Info seq  [hh:mm:ss:mss] request:
    {
      "command": "configure",
      "arguments": {
        "preferences": {
          "displayPartsForJSDoc": true
        }
      },
      "seq": 1,
      "type": "request"
    }
Info seq  [hh:mm:ss:mss] response:
    {"seq":0,"type":"response","command":"configure","request_seq":1,"success":true}
Info seq  [hh:mm:ss:mss] response:
    {
      "responseRequired": false
    }
After request

Before request

Info seq  [hh:mm:ss:mss] request:
    {
      "command": "open",
      "arguments": {
        "file": "/a/someFile1.js"
      },
      "seq": 2,
      "type": "request"
    }
Info seq  [hh:mm:ss:mss] Search path: /a
Info seq  [hh:mm:ss:mss] For info: /a/someFile1.js :: Config file name: /a/tsconfig.json
Info seq  [hh:mm:ss:mss] Creating configuration project /a/tsconfig.json
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/tsconfig.json 2000 undefined Project: /a/tsconfig.json WatchType: Config file
Info seq  [hh:mm:ss:mss] Config: /a/tsconfig.json : {
 "rootNames": [
  "/a/someFile1.js"
 ],
 "options": {
  "checkJs": true,
  "noEmit": true,
  "configFilePath": "/a/tsconfig.json"
 }
}
Info seq  [hh:mm:ss:mss] Starting updateGraphWorker: Project: /a/tsconfig.json
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/lib/lib.d.ts 500 undefined Project: /a/tsconfig.json WatchType: Missing file
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Added:: WatchInfo: /a/node_modules/@types 1 undefined Project: /a/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Added:: WatchInfo: /a/node_modules/@types 1 undefined Project: /a/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Finishing updateGraphWorker: Project: /a/tsconfig.json Version: 1 structureChanged: true structureIsReused:: Not Elapsed:: *ms
Info seq  [hh:mm:ss:mss] Project '/a/tsconfig.json' (Configured)
Info seq  [hh:mm:ss:mss] 	Files (1)
	/a/someFile1.js SVC-1-0 "class C { }\n/** @wat {@link C} */\nvar x = 1"


	someFile1.js
	  Part of 'files' list in tsconfig.json

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] Project '/a/tsconfig.json' (Configured)
Info seq  [hh:mm:ss:mss] 	Files (1)

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] Open files: 
Info seq  [hh:mm:ss:mss] 	FileName: /a/someFile1.js ProjectRootPath: undefined
Info seq  [hh:mm:ss:mss] 		Projects: /a/tsconfig.json
Info seq  [hh:mm:ss:mss] response:
    {
      "responseRequired": false
    }
After request

PolledWatches::
/a/lib/lib.d.ts: *new*
  {"pollingInterval":500}
/a/node_modules/@types: *new*
  {"pollingInterval":500}

FsWatches::
/a/tsconfig.json: *new*
  {}

Before request

Info seq  [hh:mm:ss:mss] request:
    {
      "command": "quickinfo-full",
      "arguments": {
        "file": "/a/someFile1.js",
        "position": 38
      },
      "seq": 3,
      "type": "request"
    }
Info seq  [hh:mm:ss:mss] response:
    {
      "response": {
        "kind": "var",
        "kindModifiers": "",
        "textSpan": {
          "start": 38,
          "length": 1
        },
        "displayParts": [
          {
            "text": "var",
            "kind": "keyword"
          },
          {
            "text": " ",
            "kind": "space"
          },
          {
            "text": "x",
            "kind": "localName"
          },
          {
            "text": ":",
            "kind": "punctuation"
          },
          {
            "text": " ",
            "kind": "space"
          },
          {
            "text": "number",
            "kind": "keyword"
          }
        ],
        "documentation": [],
        "tags": [
          {
            "name": "wat",
            "text": [
              {
                "text": "",
                "kind": "text"
              },
              {
                "text": "{@link ",
                "kind": "link"
              },
              {
                "text": "C",
                "kind": "linkName",
                "target": {
                  "fileName": "/a/someFile1.js",
                  "textSpan": {
                    "start": 0,
                    "length": 11
                  }
                }
              },
              {
                "text": "}",
                "kind": "link"
              }
            ]
          }
        ]
      },
      "responseRequired": true
    }
After request
