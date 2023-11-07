{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"/// var _self = (typeof window !== 'undefined') ? window // if in browser : ( (typeof WorkerGlobalScope !== 'undefined' && self instanceof W...","date":"2023-11-07T16:19:11.028Z","updated":"2023-11-07T16:19:11.028Z","comments":true,"path":"api/pages/js/prism-core.js","covers":null,"excerpt":"","content":"/// <reference lib=\"WebWorker\"/>\n\nvar _self = (typeof window !== 'undefined')\n\t? window   // if in browser\n\t: (\n\t\t(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)\n\t\t? self // if in worker\n\t\t: {}   // if in node js\n\t);\n\n/**\n * Prism: Lightweight, robust, elegant syntax highlighting\n *\n * @license MIT <https://opensource.org/licenses/MIT>\n * @author Lea Verou <https://lea.verou.me>\n * @namespace\n * @public\n */\nvar Prism = (function (_self){\n\n// Private helper vars\nvar lang = /\\blang(?:uage)?-([\\w-]+)\\b/i;\nvar uniqueId = 0;\n\n\nvar _ = {\n\t/**\n\t * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the\n\t * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load\n\t * additional languages or plugins yourself.\n\t *\n\t * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.\n\t *\n\t * You obviously have to change this value before the automatic highlighting started. To do this, you can add an\n\t * empty Prism object into the global scope before loading the Prism script like this:\n\t *\n\t * ```js\n\t * window.Prism = window.Prism || {};\n\t * Prism.manual = true;\n\t * // add a new <script> to load Prism's script\n\t * ```\n\t *\n\t * @default false\n\t * @type {boolean}\n\t * @memberof Prism\n\t * @public\n\t */\n\tmanual: _self.Prism && _self.Prism.manual,\n\tdisableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,\n\n\t/**\n\t * A namespace for utility methods.\n\t *\n\t * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may\n\t * change or disappear at any time.\n\t *\n\t * @namespace\n\t * @memberof Prism\n\t */\n\tutil: {\n\t\tencode: function encode(tokens) {\n\t\t\tif (tokens instanceof Token) {\n\t\t\t\treturn new Token(tokens.type, encode(tokens.content), tokens.alias);\n\t\t\t} else if (Array.isArray(tokens)) {\n\t\t\t\treturn tokens.map(encode);\n\t\t\t} else {\n\t\t\t\treturn tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\\u00a0/g, ' ');\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Returns the name of the type of the given value.\n\t\t *\n\t\t * @param {any} o\n\t\t * @returns {string}\n\t\t * @example\n\t\t * type(null)      === 'Null'\n\t\t * type(undefined) === 'Undefined'\n\t\t * type(123)       === 'Number'\n\t\t * type('foo')     === 'String'\n\t\t * type(true)      === 'Boolean'\n\t\t * type([1, 2])    === 'Array'\n\t\t * type({})        === 'Object'\n\t\t * type(String)    === 'Function'\n\t\t * type(/abc+/)    === 'RegExp'\n\t\t */\n\t\ttype: function (o) {\n\t\t\treturn Object.prototype.toString.call(o).slice(8, -1);\n\t\t},\n\n\t\t/**\n\t\t * Returns a unique number for the given object. Later calls will still return the same number.\n\t\t *\n\t\t * @param {Object} obj\n\t\t * @returns {number}\n\t\t */\n\t\tobjId: function (obj) {\n\t\t\tif (!obj['__id']) {\n\t\t\t\tObject.defineProperty(obj, '__id', { value: ++uniqueId });\n\t\t\t}\n\t\t\treturn obj['__id'];\n\t\t},\n\n\t\t/**\n\t\t * Creates a deep clone of the given object.\n\t\t *\n\t\t * The main intended use of this function is to clone language definitions.\n\t\t *\n\t\t * @param {T} o\n\t\t * @param {Record<number, any>} [visited]\n\t\t * @returns {T}\n\t\t * @template T\n\t\t */\n\t\tclone: function deepClone(o, visited) {\n\t\t\tvisited = visited || {};\n\n\t\t\tvar clone, id;\n\t\t\tswitch (_.util.type(o)) {\n\t\t\t\tcase 'Object':\n\t\t\t\t\tid = _.util.objId(o);\n\t\t\t\t\tif (visited[id]) {\n\t\t\t\t\t\treturn visited[id];\n\t\t\t\t\t}\n\t\t\t\t\tclone = /** @type {Record<string, any>} */ ({});\n\t\t\t\t\tvisited[id] = clone;\n\n\t\t\t\t\tfor (var key in o) {\n\t\t\t\t\t\tif (o.hasOwnProperty(key)) {\n\t\t\t\t\t\t\tclone[key] = deepClone(o[key], visited);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\treturn /** @type {any} */ (clone);\n\n\t\t\t\tcase 'Array':\n\t\t\t\t\tid = _.util.objId(o);\n\t\t\t\t\tif (visited[id]) {\n\t\t\t\t\t\treturn visited[id];\n\t\t\t\t\t}\n\t\t\t\t\tclone = [];\n\t\t\t\t\tvisited[id] = clone;\n\n\t\t\t\t\t(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {\n\t\t\t\t\t\tclone[i] = deepClone(v, visited);\n\t\t\t\t\t});\n\n\t\t\t\t\treturn /** @type {any} */ (clone);\n\n\t\t\t\tdefault:\n\t\t\t\t\treturn o;\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.\n\t\t *\n\t\t * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.\n\t\t *\n\t\t * @param {Element} element\n\t\t * @returns {string}\n\t\t */\n\t\tgetLanguage: function (element) {\n\t\t\twhile (element && !lang.test(element.className)) {\n\t\t\t\telement = element.parentElement;\n\t\t\t}\n\t\t\tif (element) {\n\t\t\t\treturn (element.className.match(lang) || [, 'none'])[1].toLowerCase();\n\t\t\t}\n\t\t\treturn 'none';\n\t\t},\n\n\t\t/**\n\t\t * Returns the script element that is currently executing.\n\t\t *\n\t\t * This does __not__ work for line script element.\n\t\t *\n\t\t * @returns {HTMLScriptElement | null}\n\t\t */\n\t\tcurrentScript: function () {\n\t\t\tif (typeof document === 'undefined') {\n\t\t\t\treturn null;\n\t\t\t}\n\t\t\tif ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {\n\t\t\t\treturn /** @type {any} */ (document.currentScript);\n\t\t\t}\n\n\t\t\t// IE11 workaround\n\t\t\t// we'll get the src of the current script by parsing IE11's error stack trace\n\t\t\t// this will not work for inline scripts\n\n\t\t\ttry {\n\t\t\t\tthrow new Error();\n\t\t\t} catch (err) {\n\t\t\t\t// Get file src url from stack. Specifically works with the format of stack traces in IE.\n\t\t\t\t// A stack will look like this:\n\t\t\t\t//\n\t\t\t\t// Error\n\t\t\t\t//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)\n\t\t\t\t//    at Global code (http://localhost/components/prism-core.js:606:1)\n\n\t\t\t\tvar src = (/at [^(\\r\\n]*\\((.*):.+:.+\\)$/i.exec(err.stack) || [])[1];\n\t\t\t\tif (src) {\n\t\t\t\t\tvar scripts = document.getElementsByTagName('script');\n\t\t\t\t\tfor (var i in scripts) {\n\t\t\t\t\t\tif (scripts[i].src == src) {\n\t\t\t\t\t\t\treturn scripts[i];\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn null;\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Returns whether a given class is active for `element`.\n\t\t *\n\t\t * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated\n\t\t * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the\n\t\t * given class is just the given class with a `no-` prefix.\n\t\t *\n\t\t * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is\n\t\t * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its\n\t\t * ancestors have the given class or the negated version of it, then the default activation will be returned.\n\t\t *\n\t\t * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated\n\t\t * version of it, the class is considered active.\n\t\t *\n\t\t * @param {Element} element\n\t\t * @param {string} className\n\t\t * @param {boolean} [defaultActivation=false]\n\t\t * @returns {boolean}\n\t\t */\n\t\tisActive: function (element, className, defaultActivation) {\n\t\t\tvar no = 'no-' + className;\n\n\t\t\twhile (element) {\n\t\t\t\tvar classList = element.classList;\n\t\t\t\tif (classList.contains(className)) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t\tif (classList.contains(no)) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t\telement = element.parentElement;\n\t\t\t}\n\t\t\treturn !!defaultActivation;\n\t\t}\n\t},\n\n\t/**\n\t * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.\n\t *\n\t * @namespace\n\t * @memberof Prism\n\t * @public\n\t */\n\tlanguages: {\n\t\t/**\n\t\t * Creates a deep copy of the language with the given id and appends the given tokens.\n\t\t *\n\t\t * If a token in `redef` also appears in the copied language, then the existing token in the copied language\n\t\t * will be overwritten at its original position.\n\t\t *\n\t\t * ## Best practices\n\t\t *\n\t\t * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)\n\t\t * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to\n\t\t * understand the language definition because, normally, the order of tokens matters in Prism grammars.\n\t\t *\n\t\t * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.\n\t\t * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.\n\t\t *\n\t\t * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.\n\t\t * @param {Grammar} redef The new tokens to append.\n\t\t * @returns {Grammar} The new language created.\n\t\t * @public\n\t\t * @example\n\t\t * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {\n\t\t *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token\n\t\t *     // at its original position\n\t\t *     'comment': { ... },\n\t\t *     // CSS doesn't have a 'color' token, so this token will be appended\n\t\t *     'color': /\\b(?:red|green|blue)\\b/\n\t\t * });\n\t\t */\n\t\textend: function (id, redef) {\n\t\t\tvar lang = _.util.clone(_.languages[id]);\n\n\t\t\tfor (var key in redef) {\n\t\t\t\tlang[key] = redef[key];\n\t\t\t}\n\n\t\t\treturn lang;\n\t\t},\n\n\t\t/**\n\t\t * Inserts tokens _before_ another token in a language definition or any other grammar.\n\t\t *\n\t\t * ## Usage\n\t\t *\n\t\t * This helper method makes it easy to modify existing languages. For example, the CSS language definition\n\t\t * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded\n\t\t * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the\n\t\t * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do\n\t\t * this:\n\t\t *\n\t\t * ```js\n\t\t * Prism.languages.markup.style = {\n\t\t *     // token\n\t\t * };\n\t\t * ```\n\t\t *\n\t\t * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens\n\t\t * before existing tokens. For the CSS example above, you would use it like this:\n\t\t *\n\t\t * ```js\n\t\t * Prism.languages.insertBefore('markup', 'cdata', {\n\t\t *     'style': {\n\t\t *         // token\n\t\t *     }\n\t\t * });\n\t\t * ```\n\t\t *\n\t\t * ## Special cases\n\t\t *\n\t\t * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar\n\t\t * will be ignored.\n\t\t *\n\t\t * This behavior can be used to insert tokens after `before`:\n\t\t *\n\t\t * ```js\n\t\t * Prism.languages.insertBefore('markup', 'comment', {\n\t\t *     'comment': Prism.languages.markup.comment,\n\t\t *     // tokens after 'comment'\n\t\t * });\n\t\t * ```\n\t\t *\n\t\t * ## Limitations\n\t\t *\n\t\t * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object\n\t\t * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave\n\t\t * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily\n\t\t * deleting properties which is necessary to insert at arbitrary positions.\n\t\t *\n\t\t * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.\n\t\t * Instead, it will create a new object and replace all references to the target object with the new one. This\n\t\t * can be done without temporarily deleting properties, so the iteration order is well-defined.\n\t\t *\n\t\t * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if\n\t\t * you hold the target object in a variable, then the value of the variable will not change.\n\t\t *\n\t\t * ```js\n\t\t * var oldMarkup = Prism.languages.markup;\n\t\t * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });\n\t\t *\n\t\t * assert(oldMarkup !== Prism.languages.markup);\n\t\t * assert(newMarkup === Prism.languages.markup);\n\t\t * ```\n\t\t *\n\t\t * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the\n\t\t * object to be modified.\n\t\t * @param {string} before The key to insert before.\n\t\t * @param {Grammar} insert An object containing the key-value pairs to be inserted.\n\t\t * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the\n\t\t * object to be modified.\n\t\t *\n\t\t * Defaults to `Prism.languages`.\n\t\t * @returns {Grammar} The new grammar object.\n\t\t * @public\n\t\t */\n\t\tinsertBefore: function (inside, before, insert, root) {\n\t\t\troot = root || /** @type {any} */ (_.languages);\n\t\t\tvar grammar = root[inside];\n\t\t\t/** @type {Grammar} */\n\t\t\tvar ret = {};\n\n\t\t\tfor (var token in grammar) {\n\t\t\t\tif (grammar.hasOwnProperty(token)) {\n\n\t\t\t\t\tif (token == before) {\n\t\t\t\t\t\tfor (var newToken in insert) {\n\t\t\t\t\t\t\tif (insert.hasOwnProperty(newToken)) {\n\t\t\t\t\t\t\t\tret[newToken] = insert[newToken];\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\t// Do not insert token which also occur in insert. See #1525\n\t\t\t\t\tif (!insert.hasOwnProperty(token)) {\n\t\t\t\t\t\tret[token] = grammar[token];\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tvar old = root[inside];\n\t\t\troot[inside] = ret;\n\n\t\t\t// Update references in other language definitions\n\t\t\t_.languages.DFS(_.languages, function(key, value) {\n\t\t\t\tif (value === old && key != inside) {\n\t\t\t\t\tthis[key] = ret;\n\t\t\t\t}\n\t\t\t});\n\n\t\t\treturn ret;\n\t\t},\n\n\t\t// Traverse a language definition with Depth First Search\n\t\tDFS: function DFS(o, callback, type, visited) {\n\t\t\tvisited = visited || {};\n\n\t\t\tvar objId = _.util.objId;\n\n\t\t\tfor (var i in o) {\n\t\t\t\tif (o.hasOwnProperty(i)) {\n\t\t\t\t\tcallback.call(o, i, o[i], type || i);\n\n\t\t\t\t\tvar property = o[i],\n\t\t\t\t\t    propertyType = _.util.type(property);\n\n\t\t\t\t\tif (propertyType === 'Object' && !visited[objId(property)]) {\n\t\t\t\t\t\tvisited[objId(property)] = true;\n\t\t\t\t\t\tDFS(property, callback, null, visited);\n\t\t\t\t\t}\n\t\t\t\t\telse if (propertyType === 'Array' && !visited[objId(property)]) {\n\t\t\t\t\t\tvisited[objId(property)] = true;\n\t\t\t\t\t\tDFS(property, callback, i, visited);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\tplugins: {},\n\n\t/**\n\t * This is the most high-level function in Prism’s API.\n\t * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on\n\t * each one of them.\n\t *\n\t * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.\n\t *\n\t * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.\n\t * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.\n\t * @memberof Prism\n\t * @public\n\t */\n\thighlightAll: function(async, callback) {\n\t\t_.highlightAllUnder(document, async, callback);\n\t},\n\n\t/**\n\t * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls\n\t * {@link Prism.highlightElement} on each one of them.\n\t *\n\t * The following hooks will be run:\n\t * 1. `before-highlightall`\n\t * 2. `before-all-elements-highlight`\n\t * 3. All hooks of {@link Prism.highlightElement} for each element.\n\t *\n\t * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.\n\t * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.\n\t * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.\n\t * @memberof Prism\n\t * @public\n\t */\n\thighlightAllUnder: function(container, async, callback) {\n\t\tvar env = {\n\t\t\tcallback: callback,\n\t\t\tcontainer: container,\n\t\t\tselector: 'code[class*=\"language-\"], [class*=\"language-\"] code, code[class*=\"lang-\"], [class*=\"lang-\"] code'\n\t\t};\n\n\t\t_.hooks.run('before-highlightall', env);\n\n\t\tenv.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));\n\n\t\t_.hooks.run('before-all-elements-highlight', env);\n\n\t\tfor (var i = 0, element; element = env.elements[i++];) {\n\t\t\t_.highlightElement(element, async === true, env.callback);\n\t\t}\n\t},\n\n\t/**\n\t * Highlights the code inside a single element.\n\t *\n\t * The following hooks will be run:\n\t * 1. `before-sanity-check`\n\t * 2. `before-highlight`\n\t * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.\n\t * 4. `before-insert`\n\t * 5. `after-highlight`\n\t * 6. `complete`\n\t *\n\t * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for\n\t * the element's language.\n\t *\n\t * @param {Element} element The element containing the code.\n\t * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.\n\t * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers\n\t * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is\n\t * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).\n\t *\n\t * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for\n\t * asynchronous highlighting to work. You can build your own bundle on the\n\t * [Download page](https://prismjs.com/download.html).\n\t * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.\n\t * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.\n\t * @memberof Prism\n\t * @public\n\t */\n\thighlightElement: function(element, async, callback) {\n\t\t// Find language\n\t\tvar language = _.util.getLanguage(element);\n\t\tvar grammar = _.languages[language];\n\n\t\t// Set language on the element, if not present\n\t\telement.className = element.className.replace(lang, '').replace(/\\s+/g, ' ') + ' language-' + language;\n\n\t\t// Set language on the parent, for styling\n\t\tvar parent = element.parentElement;\n\t\tif (parent && parent.nodeName.toLowerCase() === 'pre') {\n\t\t\tparent.className = parent.className.replace(lang, '').replace(/\\s+/g, ' ') + ' language-' + language;\n\t\t}\n\n\t\tvar code = element.textContent;\n\n\t\tvar env = {\n\t\t\telement: element,\n\t\t\tlanguage: language,\n\t\t\tgrammar: grammar,\n\t\t\tcode: code\n\t\t};\n\n\t\tfunction insertHighlightedCode(highlightedCode) {\n\t\t\tenv.highlightedCode = highlightedCode;\n\n\t\t\t_.hooks.run('before-insert', env);\n\n\t\t\tenv.element.innerHTML = env.highlightedCode;\n\n\t\t\t_.hooks.run('after-highlight', env);\n\t\t\t_.hooks.run('complete', env);\n\t\t\tcallback && callback.call(env.element);\n\t\t}\n\n\t\t_.hooks.run('before-sanity-check', env);\n\n\t\tif (!env.code) {\n\t\t\t_.hooks.run('complete', env);\n\t\t\tcallback && callback.call(env.element);\n\t\t\treturn;\n\t\t}\n\n\t\t_.hooks.run('before-highlight', env);\n\n\t\tif (!env.grammar) {\n\t\t\tinsertHighlightedCode(_.util.encode(env.code));\n\t\t\treturn;\n\t\t}\n\n\t\tif (async && _self.Worker) {\n\t\t\tvar worker = new Worker(_.filename);\n\n\t\t\tworker.onmessage = function(evt) {\n\t\t\t\tinsertHighlightedCode(evt.data);\n\t\t\t};\n\n\t\t\tworker.postMessage(JSON.stringify({\n\t\t\t\tlanguage: env.language,\n\t\t\t\tcode: env.code,\n\t\t\t\timmediateClose: true\n\t\t\t}));\n\t\t}\n\t\telse {\n\t\t\tinsertHighlightedCode(_.highlight(env.code, env.grammar, env.language));\n\t\t}\n\t},\n\n\t/**\n\t * Low-level function, only use if you know what you’re doing. It accepts a string of text as input\n\t * and the language definitions to use, and returns a string with the HTML produced.\n\t *\n\t * The following hooks will be run:\n\t * 1. `before-tokenize`\n\t * 2. `after-tokenize`\n\t * 3. `wrap`: On each {@link Token}.\n\t *\n\t * @param {string} text A string with the code to be highlighted.\n\t * @param {Grammar} grammar An object containing the tokens to use.\n\t *\n\t * Usually a language definition like `Prism.languages.markup`.\n\t * @param {string} language The name of the language definition passed to `grammar`.\n\t * @returns {string} The highlighted HTML.\n\t * @memberof Prism\n\t * @public\n\t * @example\n\t * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');\n\t */\n\thighlight: function (text, grammar, language) {\n\t\tvar env = {\n\t\t\tcode: text,\n\t\t\tgrammar: grammar,\n\t\t\tlanguage: language\n\t\t};\n\t\t_.hooks.run('before-tokenize', env);\n\t\tenv.tokens = _.tokenize(env.code, env.grammar);\n\t\t_.hooks.run('after-tokenize', env);\n\t\treturn Token.stringify(_.util.encode(env.tokens), env.language);\n\t},\n\n\t/**\n\t * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input\n\t * and the language definitions to use, and returns an array with the tokenized code.\n\t *\n\t * When the language definition includes nested tokens, the function is called recursively on each of these tokens.\n\t *\n\t * This method could be useful in other contexts as well, as a very crude parser.\n\t *\n\t * @param {string} text A string with the code to be highlighted.\n\t * @param {Grammar} grammar An object containing the tokens to use.\n\t *\n\t * Usually a language definition like `Prism.languages.markup`.\n\t * @returns {TokenStream} An array of strings and tokens, a token stream.\n\t * @memberof Prism\n\t * @public\n\t * @example\n\t * let code = `var foo = 0;`;\n\t * let tokens = Prism.tokenize(code, Prism.languages.javascript);\n\t * tokens.forEach(token => {\n\t *     if (token instanceof Prism.Token && token.type === 'number') {\n\t *         console.log(`Found numeric literal: ${token.content}`);\n\t *     }\n\t * });\n\t */\n\ttokenize: function(text, grammar) {\n\t\tvar rest = grammar.rest;\n\t\tif (rest) {\n\t\t\tfor (var token in rest) {\n\t\t\t\tgrammar[token] = rest[token];\n\t\t\t}\n\n\t\t\tdelete grammar.rest;\n\t\t}\n\n\t\tvar tokenList = new LinkedList();\n\t\taddAfter(tokenList, tokenList.head, text);\n\n\t\tmatchGrammar(text, tokenList, grammar, tokenList.head, 0);\n\n\t\treturn toArray(tokenList);\n\t},\n\n\t/**\n\t * @namespace\n\t * @memberof Prism\n\t * @public\n\t */\n\thooks: {\n\t\tall: {},\n\n\t\t/**\n\t\t * Adds the given callback to the list of callbacks for the given hook.\n\t\t *\n\t\t * The callback will be invoked when the hook it is registered for is run.\n\t\t * Hooks are usually directly run by a highlight function but you can also run hooks yourself.\n\t\t *\n\t\t * One callback function can be registered to multiple hooks and the same hook multiple times.\n\t\t *\n\t\t * @param {string} name The name of the hook.\n\t\t * @param {HookCallback} callback The callback function which is given environment variables.\n\t\t * @public\n\t\t */\n\t\tadd: function (name, callback) {\n\t\t\tvar hooks = _.hooks.all;\n\n\t\t\thooks[name] = hooks[name] || [];\n\n\t\t\thooks[name].push(callback);\n\t\t},\n\n\t\t/**\n\t\t * Runs a hook invoking all registered callbacks with the given environment variables.\n\t\t *\n\t\t * Callbacks will be invoked synchronously and in the order in which they were registered.\n\t\t *\n\t\t * @param {string} name The name of the hook.\n\t\t * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.\n\t\t * @public\n\t\t */\n\t\trun: function (name, env) {\n\t\t\tvar callbacks = _.hooks.all[name];\n\n\t\t\tif (!callbacks || !callbacks.length) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tfor (var i=0, callback; callback = callbacks[i++];) {\n\t\t\t\tcallback(env);\n\t\t\t}\n\t\t}\n\t},\n\n\tToken: Token\n};\n_self.Prism = _;\n\n\n// Typescript note:\n// The following can be used to import the Token type in JSDoc:\n//\n//   @typedef {InstanceType<import(\"./prism-core\")[\"Token\"]>} Token\n\n/**\n * Creates a new token.\n *\n * @param {string} type See {@link Token#type type}\n * @param {string | TokenStream} content See {@link Token#content content}\n * @param {string|string[]} [alias] The alias(es) of the token.\n * @param {string} [matchedStr=\"\"] A copy of the full string this token was created from.\n * @class\n * @global\n * @public\n */\nfunction Token(type, content, alias, matchedStr) {\n\t/**\n\t * The type of the token.\n\t *\n\t * This is usually the key of a pattern in a {@link Grammar}.\n\t *\n\t * @type {string}\n\t * @see GrammarToken\n\t * @public\n\t */\n\tthis.type = type;\n\t/**\n\t * The strings or tokens contained by this token.\n\t *\n\t * This will be a token stream if the pattern matched also defined an `inside` grammar.\n\t *\n\t * @type {string | TokenStream}\n\t * @public\n\t */\n\tthis.content = content;\n\t/**\n\t * The alias(es) of the token.\n\t *\n\t * @type {string|string[]}\n\t * @see GrammarToken\n\t * @public\n\t */\n\tthis.alias = alias;\n\t// Copy of the full string this token was created from\n\tthis.length = (matchedStr || '').length | 0;\n}\n\n/**\n * A token stream is an array of strings and {@link Token Token} objects.\n *\n * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process\n * them.\n *\n * 1. No adjacent strings.\n * 2. No empty strings.\n *\n *    The only exception here is the token stream that only contains the empty string and nothing else.\n *\n * @typedef {Array<string | Token>} TokenStream\n * @global\n * @public\n */\n\n/**\n * Converts the given token or token stream to an HTML representation.\n *\n * The following hooks will be run:\n * 1. `wrap`: On each {@link Token}.\n *\n * @param {string | Token | TokenStream} o The token or token stream to be converted.\n * @param {string} language The name of current language.\n * @returns {string} The HTML representation of the token or token stream.\n * @memberof Token\n * @static\n */\nToken.stringify = function stringify(o, language) {\n\tif (typeof o == 'string') {\n\t\treturn o;\n\t}\n\tif (Array.isArray(o)) {\n\t\tvar s = '';\n\t\to.forEach(function (e) {\n\t\t\ts += stringify(e, language);\n\t\t});\n\t\treturn s;\n\t}\n\n\tvar env = {\n\t\ttype: o.type,\n\t\tcontent: stringify(o.content, language),\n\t\ttag: 'span',\n\t\tclasses: ['token', o.type],\n\t\tattributes: {},\n\t\tlanguage: language\n\t};\n\n\tvar aliases = o.alias;\n\tif (aliases) {\n\t\tif (Array.isArray(aliases)) {\n\t\t\tArray.prototype.push.apply(env.classes, aliases);\n\t\t} else {\n\t\t\tenv.classes.push(aliases);\n\t\t}\n\t}\n\n\t_.hooks.run('wrap', env);\n\n\tvar attributes = '';\n\tfor (var name in env.attributes) {\n\t\tattributes += ' ' + name + '=\"' + (env.attributes[name] || '').replace(/\"/g, '&quot;') + '\"';\n\t}\n\n\treturn '<' + env.tag + ' class=\"' + env.classes.join(' ') + '\"' + attributes + '>' + env.content + '</' + env.tag + '>';\n};\n\n/**\n * @param {RegExp} pattern\n * @param {number} pos\n * @param {string} text\n * @param {boolean} lookbehind\n * @returns {RegExpExecArray | null}\n */\nfunction matchPattern(pattern, pos, text, lookbehind) {\n\tpattern.lastIndex = pos;\n\tvar match = pattern.exec(text);\n\tif (match && lookbehind && match[1]) {\n\t\t// change the match to remove the text matched by the Prism lookbehind group\n\t\tvar lookbehindLength = match[1].length;\n\t\tmatch.index += lookbehindLength;\n\t\tmatch[0] = match[0].slice(lookbehindLength);\n\t}\n\treturn match;\n}\n\n/**\n * @param {string} text\n * @param {LinkedList<string | Token>} tokenList\n * @param {any} grammar\n * @param {LinkedListNode<string | Token>} startNode\n * @param {number} startPos\n * @param {RematchOptions} [rematch]\n * @returns {void}\n * @private\n *\n * @typedef RematchOptions\n * @property {string} cause\n * @property {number} reach\n */\nfunction matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {\n\tfor (var token in grammar) {\n\t\tif (!grammar.hasOwnProperty(token) || !grammar[token]) {\n\t\t\tcontinue;\n\t\t}\n\n\t\tvar patterns = grammar[token];\n\t\tpatterns = Array.isArray(patterns) ? patterns : [patterns];\n\n\t\tfor (var j = 0; j < patterns.length; ++j) {\n\t\t\tif (rematch && rematch.cause == token + ',' + j) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tvar patternObj = patterns[j],\n\t\t\t\tinside = patternObj.inside,\n\t\t\t\tlookbehind = !!patternObj.lookbehind,\n\t\t\t\tgreedy = !!patternObj.greedy,\n\t\t\t\talias = patternObj.alias;\n\n\t\t\tif (greedy && !patternObj.pattern.global) {\n\t\t\t\t// Without the global flag, lastIndex won't work\n\t\t\t\tvar flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];\n\t\t\t\tpatternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');\n\t\t\t}\n\n\t\t\t/** @type {RegExp} */\n\t\t\tvar pattern = patternObj.pattern || patternObj;\n\n\t\t\tfor ( // iterate the token list and keep track of the current token/string position\n\t\t\t\tvar currentNode = startNode.next, pos = startPos;\n\t\t\t\tcurrentNode !== tokenList.tail;\n\t\t\t\tpos += currentNode.value.length, currentNode = currentNode.next\n\t\t\t) {\n\n\t\t\t\tif (rematch && pos >= rematch.reach) {\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t\tvar str = currentNode.value;\n\n\t\t\t\tif (tokenList.length > text.length) {\n\t\t\t\t\t// Something went terribly wrong, ABORT, ABORT!\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (str instanceof Token) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tvar removeCount = 1; // this is the to parameter of removeBetween\n\t\t\t\tvar match;\n\n\t\t\t\tif (greedy) {\n\t\t\t\t\tmatch = matchPattern(pattern, pos, text, lookbehind);\n\t\t\t\t\tif (!match) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\tvar from = match.index;\n\t\t\t\t\tvar to = match.index + match[0].length;\n\t\t\t\t\tvar p = pos;\n\n\t\t\t\t\t// find the node that contains the match\n\t\t\t\t\tp += currentNode.value.length;\n\t\t\t\t\twhile (from >= p) {\n\t\t\t\t\t\tcurrentNode = currentNode.next;\n\t\t\t\t\t\tp += currentNode.value.length;\n\t\t\t\t\t}\n\t\t\t\t\t// adjust pos (and p)\n\t\t\t\t\tp -= currentNode.value.length;\n\t\t\t\t\tpos = p;\n\n\t\t\t\t\t// the current node is a Token, then the match starts inside another Token, which is invalid\n\t\t\t\t\tif (currentNode.value instanceof Token) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\n\t\t\t\t\t// find the last node which is affected by this match\n\t\t\t\t\tfor (\n\t\t\t\t\t\tvar k = currentNode;\n\t\t\t\t\t\tk !== tokenList.tail && (p < to || typeof k.value === 'string');\n\t\t\t\t\t\tk = k.next\n\t\t\t\t\t) {\n\t\t\t\t\t\tremoveCount++;\n\t\t\t\t\t\tp += k.value.length;\n\t\t\t\t\t}\n\t\t\t\t\tremoveCount--;\n\n\t\t\t\t\t// replace with the new match\n\t\t\t\t\tstr = text.slice(pos, p);\n\t\t\t\t\tmatch.index -= pos;\n\t\t\t\t} else {\n\t\t\t\t\tmatch = matchPattern(pattern, 0, str, lookbehind);\n\t\t\t\t\tif (!match) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tvar from = match.index,\n\t\t\t\t\tmatchStr = match[0],\n\t\t\t\t\tbefore = str.slice(0, from),\n\t\t\t\t\tafter = str.slice(from + matchStr.length);\n\n\t\t\t\tvar reach = pos + str.length;\n\t\t\t\tif (rematch && reach > rematch.reach) {\n\t\t\t\t\trematch.reach = reach;\n\t\t\t\t}\n\n\t\t\t\tvar removeFrom = currentNode.prev;\n\n\t\t\t\tif (before) {\n\t\t\t\t\tremoveFrom = addAfter(tokenList, removeFrom, before);\n\t\t\t\t\tpos += before.length;\n\t\t\t\t}\n\n\t\t\t\tremoveRange(tokenList, removeFrom, removeCount);\n\n\t\t\t\tvar wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);\n\t\t\t\tcurrentNode = addAfter(tokenList, removeFrom, wrapped);\n\n\t\t\t\tif (after) {\n\t\t\t\t\taddAfter(tokenList, currentNode, after);\n\t\t\t\t}\n\n\t\t\t\tif (removeCount > 1) {\n\t\t\t\t\t// at least one Token object was removed, so we have to do some rematching\n\t\t\t\t\t// this can only happen if the current pattern is greedy\n\t\t\t\t\tmatchGrammar(text, tokenList, grammar, currentNode.prev, pos, {\n\t\t\t\t\t\tcause: token + ',' + j,\n\t\t\t\t\t\treach: reach\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n\n/**\n * @typedef LinkedListNode\n * @property {T} value\n * @property {LinkedListNode<T> | null} prev The previous node.\n * @property {LinkedListNode<T> | null} next The next node.\n * @template T\n * @private\n */\n\n/**\n * @template T\n * @private\n */\nfunction LinkedList() {\n\t/** @type {LinkedListNode<T>} */\n\tvar head = { value: null, prev: null, next: null };\n\t/** @type {LinkedListNode<T>} */\n\tvar tail = { value: null, prev: head, next: null };\n\thead.next = tail;\n\n\t/** @type {LinkedListNode<T>} */\n\tthis.head = head;\n\t/** @type {LinkedListNode<T>} */\n\tthis.tail = tail;\n\tthis.length = 0;\n}\n\n/**\n * Adds a new node with the given value to the list.\n * @param {LinkedList<T>} list\n * @param {LinkedListNode<T>} node\n * @param {T} value\n * @returns {LinkedListNode<T>} The added node.\n * @template T\n */\nfunction addAfter(list, node, value) {\n\t// assumes that node != list.tail && values.length >= 0\n\tvar next = node.next;\n\n\tvar newNode = { value: value, prev: node, next: next };\n\tnode.next = newNode;\n\tnext.prev = newNode;\n\tlist.length++;\n\n\treturn newNode;\n}\n/**\n * Removes `count` nodes after the given node. The given node will not be removed.\n * @param {LinkedList<T>} list\n * @param {LinkedListNode<T>} node\n * @param {number} count\n * @template T\n */\nfunction removeRange(list, node, count) {\n\tvar next = node.next;\n\tfor (var i = 0; i < count && next !== list.tail; i++) {\n\t\tnext = next.next;\n\t}\n\tnode.next = next;\n\tnext.prev = node;\n\tlist.length -= i;\n}\n/**\n * @param {LinkedList<T>} list\n * @returns {T[]}\n * @template T\n */\nfunction toArray(list) {\n\tvar array = [];\n\tvar node = list.head.next;\n\twhile (node !== list.tail) {\n\t\tarray.push(node.value);\n\t\tnode = node.next;\n\t}\n\treturn array;\n}\n\n\nif (!_self.document) {\n\tif (!_self.addEventListener) {\n\t\t// in Node.js\n\t\treturn _;\n\t}\n\n\tif (!_.disableWorkerMessageHandler) {\n\t\t// In worker\n\t\t_self.addEventListener('message', function (evt) {\n\t\t\tvar message = JSON.parse(evt.data),\n\t\t\t\tlang = message.language,\n\t\t\t\tcode = message.code,\n\t\t\t\timmediateClose = message.immediateClose;\n\n\t\t\t_self.postMessage(_.highlight(code, _.languages[lang], lang));\n\t\t\tif (immediateClose) {\n\t\t\t\t_self.close();\n\t\t\t}\n\t\t}, false);\n\t}\n\n\treturn _;\n}\n\n// Get current script and highlight\nvar script = _.util.currentScript();\n\nif (script) {\n\t_.filename = script.src;\n\n\tif (script.hasAttribute('data-manual')) {\n\t\t_.manual = true;\n\t}\n}\n\nfunction highlightAutomaticallyCallback() {\n\tif (!_.manual) {\n\t\t_.highlightAll();\n\t}\n}\n\nif (!_.manual) {\n\t// If the document state is \"loading\", then we'll use DOMContentLoaded.\n\t// If the document state is \"interactive\" and the prism.js script is deferred, then we'll also use the\n\t// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they\n\t// might take longer one animation frame to execute which can create a race condition where only some plugins have\n\t// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.\n\t// See https://github.com/PrismJS/prism/issues/2102\n\tvar readyState = document.readyState;\n\tif (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {\n\t\tdocument.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);\n\t} else {\n\t\tif (window.requestAnimationFrame) {\n\t\t\twindow.requestAnimationFrame(highlightAutomaticallyCallback);\n\t\t} else {\n\t\t\twindow.setTimeout(highlightAutomaticallyCallback, 16);\n\t\t}\n\t}\n}\n\nreturn _;\n\n})(_self);\n\nif (typeof module !== 'undefined' && module.exports) {\n\tmodule.exports = Prism;\n}\n\n// hack for components to work correctly in node.js\nif (typeof global !== 'undefined') {\n\tglobal.Prism = Prism;\n}\n\n// some additional documentation/types\n\n/**\n * The expansion of a simple `RegExp` literal to support additional properties.\n *\n * @typedef GrammarToken\n * @property {RegExp} pattern The regular expression of the token.\n * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)\n * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.\n * @property {boolean} [greedy=false] Whether the token is greedy.\n * @property {string|string[]} [alias] An optional alias or list of aliases.\n * @property {Grammar} [inside] The nested grammar of this token.\n *\n * The `inside` grammar will be used to tokenize the text value of each token of this kind.\n *\n * This can be used to make nested and even recursive language definitions.\n *\n * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into\n * each another.\n * @global\n * @public\n*/\n\n/**\n * @typedef Grammar\n * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}\n * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.\n * @global\n * @public\n */\n\n/**\n * A function which will invoked after an element was successfully highlighted.\n *\n * @callback HighlightCallback\n * @param {Element} element The element successfully highlighted.\n * @returns {void}\n * @global\n * @public\n*/\n\n/**\n * @callback HookCallback\n * @param {Object<string, any>} env The environment variables of the hook.\n * @returns {void}\n * @global\n * @public\n */\n","count_time":{"symbolsCount":"28k","symbolsTime":"25 mins."},"toc":""}