currentDirectory:: /user/username/projects/myproject useCaseSensitiveFileNames: false
Input::
//// [/user/username/projects/myproject/a.ts]
import {B} from './b';
declare var console: any;
let b = new B();
console.log(b.c.d);

//// [/user/username/projects/myproject/b.ts]
import {C} from './c';
export class B
{
    c = new C();
}

//// [/user/username/projects/myproject/c.ts]
export class C
{
    d = 1;
}

//// [/user/username/projects/myproject/tsconfig.json]
{}

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


/a/lib/tsc.js --w --assumeChangesOnlyAffectDirectDependencies --incremental
Output::
>> Screen clear
[[90m12:00:25 AM[0m] Starting compilation in watch mode...

[[90m12:00:34 AM[0m] Found 0 errors. Watching for file changes.



Program root files: ["/user/username/projects/myproject/a.ts","/user/username/projects/myproject/b.ts","/user/username/projects/myproject/c.ts"]
Program options: {"watch":true,"assumeChangesOnlyAffectDirectDependencies":true,"incremental":true,"configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Not
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Semantic diagnostics in builder refreshed for::
/a/lib/lib.d.ts
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Shape signatures in builder refreshed for::
/a/lib/lib.d.ts (used version)
/user/username/projects/myproject/c.ts (used version)
/user/username/projects/myproject/b.ts (used version)
/user/username/projects/myproject/a.ts (used version)

PolledWatches::
/user/username/projects/myproject/node_modules/@types: *new*
  {"pollingInterval":500}

FsWatches::
/user/username/projects/myproject/tsconfig.json: *new*
  {}
/user/username/projects/myproject/a.ts: *new*
  {}
/user/username/projects/myproject/b.ts: *new*
  {}
/user/username/projects/myproject/c.ts: *new*
  {}
/a/lib/lib.d.ts: *new*
  {}

FsWatchesRecursive::
/user/username/projects/myproject: *new*
  {}

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C = void 0;
var C = /** @class */ (function () {
    function C() {
        this.d = 1;
    }
    return C;
}());
exports.C = C;


//// [/user/username/projects/myproject/b.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B = void 0;
var c_1 = require("./c");
var B = /** @class */ (function () {
    function B() {
        this.c = new c_1.C();
    }
    return B;
}());
exports.B = B;


//// [/user/username/projects/myproject/a.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var b_1 = require("./b");
var b = new b_1.B();
console.log(b.c.d);


//// [/user/username/projects/myproject/tsconfig.tsbuildinfo]
{"program":{"fileNames":["../../../../a/lib/lib.d.ts","./c.ts","./b.ts","./a.ts"],"fileInfos":[{"version":"-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }","affectsGlobalScope":true},"-22447130237-export class C\n{\n    d = 1;\n}","-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}","4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);"],"root":[[2,4]],"options":{"assumeChangesOnlyAffectDirectDependencies":true},"fileIdsList":[[3],[2]],"referencedMap":[[4,1],[3,2]],"exportedModulesMap":[[4,1],[3,2]],"semanticDiagnosticsPerFile":[1,4,3,2]},"version":"FakeTSVersion"}

//// [/user/username/projects/myproject/tsconfig.tsbuildinfo.readable.baseline.txt]
{
  "program": {
    "fileNames": [
      "../../../../a/lib/lib.d.ts",
      "./c.ts",
      "./b.ts",
      "./a.ts"
    ],
    "fileNamesList": [
      [
        "./b.ts"
      ],
      [
        "./c.ts"
      ]
    ],
    "fileInfos": {
      "../../../../a/lib/lib.d.ts": {
        "original": {
          "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
          "affectsGlobalScope": true
        },
        "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "signature": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "affectsGlobalScope": true
      },
      "./c.ts": {
        "version": "-22447130237-export class C\n{\n    d = 1;\n}",
        "signature": "-22447130237-export class C\n{\n    d = 1;\n}"
      },
      "./b.ts": {
        "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
        "signature": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}"
      },
      "./a.ts": {
        "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
        "signature": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);"
      }
    },
    "root": [
      [
        [
          2,
          4
        ],
        [
          "./c.ts",
          "./b.ts",
          "./a.ts"
        ]
      ]
    ],
    "options": {
      "assumeChangesOnlyAffectDirectDependencies": true
    },
    "referencedMap": {
      "./a.ts": [
        "./b.ts"
      ],
      "./b.ts": [
        "./c.ts"
      ]
    },
    "exportedModulesMap": {
      "./a.ts": [
        "./b.ts"
      ],
      "./b.ts": [
        "./c.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../../../a/lib/lib.d.ts",
      "./a.ts",
      "./b.ts",
      "./c.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 953
}


Change:: Rename property d to d2 of class C to initialize signatures

Input::
//// [/user/username/projects/myproject/c.ts]
export class C
{
    d2 = 1;
}


Before running Timeout callback:: count: 1
1: timerToUpdateProgram
After running Timeout callback:: count: 0
Output::
>> Screen clear
[[90m12:00:40 AM[0m] File change detected. Starting incremental compilation...

[96ma.ts[0m:[93m4[0m:[93m17[0m - [91merror[0m[90m TS2339: [0mProperty 'd' does not exist on type 'C'.

[7m4[0m console.log(b.c.d);
[7m [0m [91m                ~[0m

[[90m12:00:53 AM[0m] Found 1 error. Watching for file changes.



Program root files: ["/user/username/projects/myproject/a.ts","/user/username/projects/myproject/b.ts","/user/username/projects/myproject/c.ts"]
Program options: {"watch":true,"assumeChangesOnlyAffectDirectDependencies":true,"incremental":true,"configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Completely
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Semantic diagnostics in builder refreshed for::
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Shape signatures in builder refreshed for::
/user/username/projects/myproject/c.ts (computed .d.ts)
/user/username/projects/myproject/b.ts (computed .d.ts)
/user/username/projects/myproject/a.ts (computed .d.ts)

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C = void 0;
var C = /** @class */ (function () {
    function C() {
        this.d2 = 1;
    }
    return C;
}());
exports.C = C;


//// [/user/username/projects/myproject/b.js] file written with same contents
//// [/user/username/projects/myproject/a.js] file written with same contents
//// [/user/username/projects/myproject/tsconfig.tsbuildinfo]
{"program":{"fileNames":["../../../../a/lib/lib.d.ts","./c.ts","./b.ts","./a.ts"],"fileInfos":[{"version":"-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }","affectsGlobalScope":true},{"version":"-22846341163-export class C\n{\n    d2 = 1;\n}","signature":"-4637923302-export declare class C {\n    d2: number;\n}\n"},{"version":"-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}","signature":"-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"},{"version":"4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);","signature":"-3531856636-export {};\n"}],"root":[[2,4]],"options":{"assumeChangesOnlyAffectDirectDependencies":true},"fileIdsList":[[3],[2]],"referencedMap":[[4,1],[3,2]],"exportedModulesMap":[[3,2]],"semanticDiagnosticsPerFile":[1,[4,[{"file":"./a.ts","start":82,"length":1,"code":2339,"category":1,"messageText":"Property 'd' does not exist on type 'C'."}]],3,2]},"version":"FakeTSVersion"}

//// [/user/username/projects/myproject/tsconfig.tsbuildinfo.readable.baseline.txt]
{
  "program": {
    "fileNames": [
      "../../../../a/lib/lib.d.ts",
      "./c.ts",
      "./b.ts",
      "./a.ts"
    ],
    "fileNamesList": [
      [
        "./b.ts"
      ],
      [
        "./c.ts"
      ]
    ],
    "fileInfos": {
      "../../../../a/lib/lib.d.ts": {
        "original": {
          "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
          "affectsGlobalScope": true
        },
        "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "signature": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "affectsGlobalScope": true
      },
      "./c.ts": {
        "original": {
          "version": "-22846341163-export class C\n{\n    d2 = 1;\n}",
          "signature": "-4637923302-export declare class C {\n    d2: number;\n}\n"
        },
        "version": "-22846341163-export class C\n{\n    d2 = 1;\n}",
        "signature": "-4637923302-export declare class C {\n    d2: number;\n}\n"
      },
      "./b.ts": {
        "original": {
          "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
          "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
        },
        "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
        "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
      },
      "./a.ts": {
        "original": {
          "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
          "signature": "-3531856636-export {};\n"
        },
        "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
        "signature": "-3531856636-export {};\n"
      }
    },
    "root": [
      [
        [
          2,
          4
        ],
        [
          "./c.ts",
          "./b.ts",
          "./a.ts"
        ]
      ]
    ],
    "options": {
      "assumeChangesOnlyAffectDirectDependencies": true
    },
    "referencedMap": {
      "./a.ts": [
        "./b.ts"
      ],
      "./b.ts": [
        "./c.ts"
      ]
    },
    "exportedModulesMap": {
      "./b.ts": [
        "./c.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../../../a/lib/lib.d.ts",
      [
        "./a.ts",
        [
          {
            "file": "./a.ts",
            "start": 82,
            "length": 1,
            "code": 2339,
            "category": 1,
            "messageText": "Property 'd' does not exist on type 'C'."
          }
        ]
      ],
      "./b.ts",
      "./c.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 1314
}


Change:: Rename property d2 to d of class C to revert back to original text

Input::
//// [/user/username/projects/myproject/c.ts]
export class C
{
    d = 1;
}


Before running Timeout callback:: count: 1
2: timerToUpdateProgram
After running Timeout callback:: count: 0
Output::
>> Screen clear
[[90m12:01:00 AM[0m] File change detected. Starting incremental compilation...

[96ma.ts[0m:[93m4[0m:[93m17[0m - [91merror[0m[90m TS2339: [0mProperty 'd' does not exist on type 'C'.

[7m4[0m console.log(b.c.d);
[7m [0m [91m                ~[0m

[[90m12:01:10 AM[0m] Found 1 error. Watching for file changes.



Program root files: ["/user/username/projects/myproject/a.ts","/user/username/projects/myproject/b.ts","/user/username/projects/myproject/c.ts"]
Program options: {"watch":true,"assumeChangesOnlyAffectDirectDependencies":true,"incremental":true,"configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Completely
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Semantic diagnostics in builder refreshed for::
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts

Shape signatures in builder refreshed for::
/user/username/projects/myproject/c.ts (computed .d.ts)
/user/username/projects/myproject/b.ts (computed .d.ts)

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C = void 0;
var C = /** @class */ (function () {
    function C() {
        this.d = 1;
    }
    return C;
}());
exports.C = C;


//// [/user/username/projects/myproject/b.js] file written with same contents
//// [/user/username/projects/myproject/tsconfig.tsbuildinfo]
{"program":{"fileNames":["../../../../a/lib/lib.d.ts","./c.ts","./b.ts","./a.ts"],"fileInfos":[{"version":"-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }","affectsGlobalScope":true},{"version":"-22447130237-export class C\n{\n    d = 1;\n}","signature":"-6977846840-export declare class C {\n    d: number;\n}\n"},{"version":"-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}","signature":"-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"},{"version":"4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);","signature":"-3531856636-export {};\n"}],"root":[[2,4]],"options":{"assumeChangesOnlyAffectDirectDependencies":true},"fileIdsList":[[3],[2]],"referencedMap":[[4,1],[3,2]],"exportedModulesMap":[[3,2]],"semanticDiagnosticsPerFile":[1,[4,[{"file":"./a.ts","start":82,"length":1,"code":2339,"category":1,"messageText":"Property 'd' does not exist on type 'C'."}]],3,2]},"version":"FakeTSVersion"}

//// [/user/username/projects/myproject/tsconfig.tsbuildinfo.readable.baseline.txt]
{
  "program": {
    "fileNames": [
      "../../../../a/lib/lib.d.ts",
      "./c.ts",
      "./b.ts",
      "./a.ts"
    ],
    "fileNamesList": [
      [
        "./b.ts"
      ],
      [
        "./c.ts"
      ]
    ],
    "fileInfos": {
      "../../../../a/lib/lib.d.ts": {
        "original": {
          "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
          "affectsGlobalScope": true
        },
        "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "signature": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "affectsGlobalScope": true
      },
      "./c.ts": {
        "original": {
          "version": "-22447130237-export class C\n{\n    d = 1;\n}",
          "signature": "-6977846840-export declare class C {\n    d: number;\n}\n"
        },
        "version": "-22447130237-export class C\n{\n    d = 1;\n}",
        "signature": "-6977846840-export declare class C {\n    d: number;\n}\n"
      },
      "./b.ts": {
        "original": {
          "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
          "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
        },
        "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
        "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
      },
      "./a.ts": {
        "original": {
          "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
          "signature": "-3531856636-export {};\n"
        },
        "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
        "signature": "-3531856636-export {};\n"
      }
    },
    "root": [
      [
        [
          2,
          4
        ],
        [
          "./c.ts",
          "./b.ts",
          "./a.ts"
        ]
      ]
    ],
    "options": {
      "assumeChangesOnlyAffectDirectDependencies": true
    },
    "referencedMap": {
      "./a.ts": [
        "./b.ts"
      ],
      "./b.ts": [
        "./c.ts"
      ]
    },
    "exportedModulesMap": {
      "./b.ts": [
        "./c.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../../../a/lib/lib.d.ts",
      [
        "./a.ts",
        [
          {
            "file": "./a.ts",
            "start": 82,
            "length": 1,
            "code": 2339,
            "category": 1,
            "messageText": "Property 'd' does not exist on type 'C'."
          }
        ]
      ],
      "./b.ts",
      "./c.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 1312
}


Change:: Rename property d to d2 of class C

Input::
//// [/user/username/projects/myproject/c.ts]
export class C
{
    d2 = 1;
}


Before running Timeout callback:: count: 1
3: timerToUpdateProgram
After running Timeout callback:: count: 0
Output::
>> Screen clear
[[90m12:01:17 AM[0m] File change detected. Starting incremental compilation...

[96ma.ts[0m:[93m4[0m:[93m17[0m - [91merror[0m[90m TS2339: [0mProperty 'd' does not exist on type 'C'.

[7m4[0m console.log(b.c.d);
[7m [0m [91m                ~[0m

[[90m12:01:27 AM[0m] Found 1 error. Watching for file changes.



Program root files: ["/user/username/projects/myproject/a.ts","/user/username/projects/myproject/b.ts","/user/username/projects/myproject/c.ts"]
Program options: {"watch":true,"assumeChangesOnlyAffectDirectDependencies":true,"incremental":true,"configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Completely
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts
/user/username/projects/myproject/a.ts

Semantic diagnostics in builder refreshed for::
/user/username/projects/myproject/c.ts
/user/username/projects/myproject/b.ts

Shape signatures in builder refreshed for::
/user/username/projects/myproject/c.ts (computed .d.ts)
/user/username/projects/myproject/b.ts (computed .d.ts)

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C = void 0;
var C = /** @class */ (function () {
    function C() {
        this.d2 = 1;
    }
    return C;
}());
exports.C = C;


//// [/user/username/projects/myproject/b.js] file written with same contents
//// [/user/username/projects/myproject/tsconfig.tsbuildinfo]
{"program":{"fileNames":["../../../../a/lib/lib.d.ts","./c.ts","./b.ts","./a.ts"],"fileInfos":[{"version":"-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }","affectsGlobalScope":true},{"version":"-22846341163-export class C\n{\n    d2 = 1;\n}","signature":"-4637923302-export declare class C {\n    d2: number;\n}\n"},{"version":"-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}","signature":"-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"},{"version":"4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);","signature":"-3531856636-export {};\n"}],"root":[[2,4]],"options":{"assumeChangesOnlyAffectDirectDependencies":true},"fileIdsList":[[3],[2]],"referencedMap":[[4,1],[3,2]],"exportedModulesMap":[[3,2]],"semanticDiagnosticsPerFile":[1,[4,[{"file":"./a.ts","start":82,"length":1,"code":2339,"category":1,"messageText":"Property 'd' does not exist on type 'C'."}]],3,2]},"version":"FakeTSVersion"}

//// [/user/username/projects/myproject/tsconfig.tsbuildinfo.readable.baseline.txt]
{
  "program": {
    "fileNames": [
      "../../../../a/lib/lib.d.ts",
      "./c.ts",
      "./b.ts",
      "./a.ts"
    ],
    "fileNamesList": [
      [
        "./b.ts"
      ],
      [
        "./c.ts"
      ]
    ],
    "fileInfos": {
      "../../../../a/lib/lib.d.ts": {
        "original": {
          "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
          "affectsGlobalScope": true
        },
        "version": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "signature": "-7698705165-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }",
        "affectsGlobalScope": true
      },
      "./c.ts": {
        "original": {
          "version": "-22846341163-export class C\n{\n    d2 = 1;\n}",
          "signature": "-4637923302-export declare class C {\n    d2: number;\n}\n"
        },
        "version": "-22846341163-export class C\n{\n    d2 = 1;\n}",
        "signature": "-4637923302-export declare class C {\n    d2: number;\n}\n"
      },
      "./b.ts": {
        "original": {
          "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
          "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
        },
        "version": "-6292386773-import {C} from './c';\nexport class B\n{\n    c = new C();\n}",
        "signature": "-165097315-import { C } from './c';\nexport declare class B {\n    c: C;\n}\n"
      },
      "./a.ts": {
        "original": {
          "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
          "signature": "-3531856636-export {};\n"
        },
        "version": "4878398349-import {B} from './b';\ndeclare var console: any;\nlet b = new B();\nconsole.log(b.c.d);",
        "signature": "-3531856636-export {};\n"
      }
    },
    "root": [
      [
        [
          2,
          4
        ],
        [
          "./c.ts",
          "./b.ts",
          "./a.ts"
        ]
      ]
    ],
    "options": {
      "assumeChangesOnlyAffectDirectDependencies": true
    },
    "referencedMap": {
      "./a.ts": [
        "./b.ts"
      ],
      "./b.ts": [
        "./c.ts"
      ]
    },
    "exportedModulesMap": {
      "./b.ts": [
        "./c.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../../../a/lib/lib.d.ts",
      [
        "./a.ts",
        [
          {
            "file": "./a.ts",
            "start": 82,
            "length": 1,
            "code": 2339,
            "category": 1,
            "messageText": "Property 'd' does not exist on type 'C'."
          }
        ]
      ],
      "./b.ts",
      "./c.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 1314
}

