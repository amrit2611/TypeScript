currentDirectory:: / useCaseSensitiveFileNames: false
Info seq  [hh:mm:ss:mss] Provided types map file "/typesMap.json" doesn't exist
Creating project service
//// [/a/b/projects/project/src/file1.ts]


//// [/a/lib/lib.d.ts]
/// <reference no-default-lib="true"/>
interface Boolean {}
interface Function {}
interface CallableFunction {}
interface NewableFunction {}
interface IArguments {}
interface Number { toExponential: any; }
interface Object {}
interface RegExp {}
interface String { charAt: any; }
interface Array<T> { length: number; [n: number]: T; }

//// [/a/b/projects/project/src/tsconfig.json]
{}

//// [/a/b/projects/tsconfig.json]
{}


Info seq  [hh:mm:ss:mss] Search path: /a/b/projects/project/src
Info seq  [hh:mm:ss:mss] For info: /a/b/projects/project/src/file1.ts :: Config file name: /a/b/projects/project/src/tsconfig.json
Info seq  [hh:mm:ss:mss] Creating configuration project /a/b/projects/project/src/tsconfig.json
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/b/projects/project/src/tsconfig.json 2000 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Config file
Info seq  [hh:mm:ss:mss] Config: /a/b/projects/project/src/tsconfig.json : {
 "rootNames": [
  "/a/b/projects/project/src/file1.ts"
 ],
 "options": {
  "configFilePath": "/a/b/projects/project/src/tsconfig.json"
 }
}
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/src 1 undefined Config: /a/b/projects/project/src/tsconfig.json WatchType: Wild card directory
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/src 1 undefined Config: /a/b/projects/project/src/tsconfig.json WatchType: Wild card directory
Info seq  [hh:mm:ss:mss] Starting updateGraphWorker: Project: /a/b/projects/project/src/tsconfig.json
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/lib/lib.d.ts 500 undefined WatchType: Closed Script info
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/src/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/src/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Finishing updateGraphWorker: Project: /a/b/projects/project/src/tsconfig.json Version: 1 structureChanged: true structureIsReused:: Not Elapsed:: *ms
Info seq  [hh:mm:ss:mss] Project '/a/b/projects/project/src/tsconfig.json' (Configured)
Info seq  [hh:mm:ss:mss] 	Files (2)
	/a/lib/lib.d.ts Text-1 "/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }"
	/a/b/projects/project/src/file1.ts SVC-1-0 ""


	../../../../lib/lib.d.ts
	  Default library for target 'es5'
	file1.ts
	  Matched by default include pattern '**/*'

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] Project '/a/b/projects/project/src/tsconfig.json' (Configured)
Info seq  [hh:mm:ss:mss] 	Files (2)

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] Open files: 
Info seq  [hh:mm:ss:mss] 	FileName: /a/b/projects/project/src/file1.ts ProjectRootPath: /a/b/projects/project
Info seq  [hh:mm:ss:mss] 		Projects: /a/b/projects/project/src/tsconfig.json
Info seq  [hh:mm:ss:mss] FileWatcher:: Triggered with /a/b/projects/project/src/tsconfig.json 2:: WatchInfo: /a/b/projects/project/src/tsconfig.json 2000 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Config file
Info seq  [hh:mm:ss:mss] `remove Project::
Info seq  [hh:mm:ss:mss] Project '/a/b/projects/project/src/tsconfig.json' (Configured)
Info seq  [hh:mm:ss:mss] 	Files (2)
	/a/lib/lib.d.ts
	/a/b/projects/project/src/file1.ts


	../../../../lib/lib.d.ts
	  Default library for target 'es5'
	file1.ts
	  Matched by default include pattern '**/*'

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/src 1 undefined Config: /a/b/projects/project/src/tsconfig.json WatchType: Wild card directory
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/src 1 undefined Config: /a/b/projects/project/src/tsconfig.json WatchType: Wild card directory
Info seq  [hh:mm:ss:mss] FileWatcher:: Close:: WatchInfo: /a/b/projects/project/src/tsconfig.json 2000 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Config file
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/src/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/src/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Close:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Type roots
Info seq  [hh:mm:ss:mss] Search path: /a/b/projects/project/src
Info seq  [hh:mm:ss:mss] For info: /a/b/projects/project/src/file1.ts :: No config files found.
Info seq  [hh:mm:ss:mss] Scheduled: *ensureProjectForOpenFiles*
Info seq  [hh:mm:ss:mss] Elapsed:: *ms FileWatcher:: Triggered with /a/b/projects/project/src/tsconfig.json 2:: WatchInfo: /a/b/projects/project/src/tsconfig.json 2000 undefined Project: /a/b/projects/project/src/tsconfig.json WatchType: Config file
Before running Timeout callback:: count: 1
1: *ensureProjectForOpenFiles*
//// [/a/b/projects/project/src/tsconfig.json] deleted

FsWatches::
/a/lib/lib.d.ts: *new*
  {}

Host is moving to new time
Info seq  [hh:mm:ss:mss] Running: *ensureProjectForOpenFiles*
Info seq  [hh:mm:ss:mss] Before ensureProjectForOpenFiles:
Info seq  [hh:mm:ss:mss] Open files: 
Info seq  [hh:mm:ss:mss] 	FileName: /a/b/projects/project/src/file1.ts ProjectRootPath: /a/b/projects/project
Info seq  [hh:mm:ss:mss] 		Projects: 
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/b/projects/project/src/tsconfig.json 2000 undefined WatchType: Config file for the inferred project root
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/b/projects/project/src/jsconfig.json 2000 undefined WatchType: Config file for the inferred project root
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/b/projects/project/tsconfig.json 2000 undefined WatchType: Config file for the inferred project root
Info seq  [hh:mm:ss:mss] FileWatcher:: Added:: WatchInfo: /a/b/projects/project/jsconfig.json 2000 undefined WatchType: Config file for the inferred project root
Info seq  [hh:mm:ss:mss] Starting updateGraphWorker: Project: /dev/null/inferredProject1*
Info seq  [hh:mm:ss:mss] DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /dev/null/inferredProject1* WatchType: Type roots
Info seq  [hh:mm:ss:mss] Elapsed:: *ms DirectoryWatcher:: Added:: WatchInfo: /a/b/projects/project/node_modules/@types 1 undefined Project: /dev/null/inferredProject1* WatchType: Type roots
Info seq  [hh:mm:ss:mss] Finishing updateGraphWorker: Project: /dev/null/inferredProject1* Version: 1 structureChanged: true structureIsReused:: Not Elapsed:: *ms
Info seq  [hh:mm:ss:mss] Project '/dev/null/inferredProject1*' (Inferred)
Info seq  [hh:mm:ss:mss] 	Files (2)
	/a/lib/lib.d.ts Text-1 "/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }"
	/a/b/projects/project/src/file1.ts SVC-1-0 ""


	../../../lib/lib.d.ts
	  Default library for target 'es5'
	src/file1.ts
	  Root file specified for compilation

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] After ensureProjectForOpenFiles:
Info seq  [hh:mm:ss:mss] Project '/dev/null/inferredProject1*' (Inferred)
Info seq  [hh:mm:ss:mss] 	Files (2)

Info seq  [hh:mm:ss:mss] -----------------------------------------------
Info seq  [hh:mm:ss:mss] Open files: 
Info seq  [hh:mm:ss:mss] 	FileName: /a/b/projects/project/src/file1.ts ProjectRootPath: /a/b/projects/project
Info seq  [hh:mm:ss:mss] 		Projects: /dev/null/inferredProject1*
After running Timeout callback:: count: 0

PolledWatches::
/a/b/projects/project/src/tsconfig.json: *new*
  {"pollingInterval":2000}
/a/b/projects/project/src/jsconfig.json: *new*
  {"pollingInterval":2000}
/a/b/projects/project/tsconfig.json: *new*
  {"pollingInterval":2000}
/a/b/projects/project/jsconfig.json: *new*
  {"pollingInterval":2000}
/a/b/projects/project/node_modules/@types: *new*
  {"pollingInterval":500}

FsWatches::
/a/lib/lib.d.ts:
  {}
