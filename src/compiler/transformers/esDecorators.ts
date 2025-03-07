import {
    addEmitHelpers,
    addInternalEmitFlags,
    addRange,
    AllDecorators,
    AnonymousFunctionDefinition,
    append,
    ArrayAssignmentElement,
    AssignmentPattern,
    AsteriskToken,
    BinaryExpression,
    BindingElement,
    Block,
    Bundle,
    CallExpression,
    chainBundle,
    childIsDecorated,
    ClassDeclaration,
    ClassElement,
    ClassExpression,
    ClassLikeDeclaration,
    classOrConstructorParameterIsDecorated,
    ClassStaticBlockDeclaration,
    CommaListExpression,
    ComputedPropertyName,
    ConstructorDeclaration,
    createAccessorPropertyBackingField,
    Debug,
    Decorator,
    ElementAccessExpression,
    EmitFlags,
    ESDecorateClassElementContext,
    ESDecorateName,
    expandPreOrPostfixIncrementOrDecrementExpression,
    ExportAssignment,
    Expression,
    ExpressionStatement,
    findComputedPropertyNameCacheAssignment,
    findSuperStatementIndex,
    firstOrUndefined,
    forEachEntry,
    ForStatement,
    GeneratedIdentifierFlags,
    GetAccessorDeclaration,
    getAllDecoratorsOfClass,
    getAllDecoratorsOfClassElement,
    getCommentRange,
    getEffectiveBaseTypeNode,
    getFirstConstructorWithBody,
    getHeritageClause,
    getNonAssignmentOperatorForCompoundAssignment,
    getOrCreateEmitNode,
    getOriginalNode,
    getSourceMapRange,
    hasAccessorModifier,
    hasDecorators,
    hasStaticModifier,
    hasSyntacticModifier,
    HeritageClause,
    Identifier,
    idText,
    InternalEmitFlags,
    isAmbientPropertyDeclaration,
    isArrayBindingOrAssignmentElement,
    isArrayLiteralExpression,
    isArrowFunction,
    isAssignmentExpression,
    isAsyncModifier,
    isAutoAccessorPropertyDeclaration,
    isBindingName,
    isBlock,
    isClassElement,
    isClassExpression,
    isClassLike,
    isClassStaticBlockDeclaration,
    isCompoundAssignment,
    isComputedPropertyName,
    isDestructuringAssignment,
    isElementAccessExpression,
    isEmptyStringLiteral,
    isExpression,
    isForInitializer,
    isFunctionExpression,
    isGeneratedIdentifier,
    isGetAccessor,
    isGetAccessorDeclaration,
    isHeritageClause,
    isIdentifier,
    isIdentifierText,
    isLeftHandSideExpression,
    isMethodDeclaration,
    isMethodOrAccessor,
    isModifier,
    isNamedClassElement,
    isNamedEvaluation,
    isObjectBindingOrAssignmentElement,
    isObjectLiteralElementLike,
    isObjectLiteralExpression,
    isOmittedExpression,
    isParameter,
    isParenthesizedExpression,
    isPrivateIdentifier,
    isPrivateIdentifierClassElementDeclaration,
    isPropertyAssignment,
    isPropertyDeclaration,
    isPropertyName,
    isPropertyNameLiteral,
    isSetAccessor,
    isSetAccessorDeclaration,
    isShorthandPropertyAssignment,
    isSimpleInlineableExpression,
    isSpreadAssignment,
    isSpreadElement,
    isStatement,
    isStatic,
    isStaticModifier,
    isStringLiteral,
    isSuperProperty,
    isTemplateLiteral,
    LeftHandSideExpression,
    map,
    MethodDeclaration,
    Modifier,
    ModifierFlags,
    ModifierLike,
    ModifiersArray,
    moveRangePastDecorators,
    moveRangePastModifiers,
    Node,
    NodeArray,
    NodeFlags,
    nodeOrChildIsDecorated,
    ObjectLiteralElement,
    OmittedExpression,
    ParameterDeclaration,
    ParenthesizedExpression,
    PartiallyEmittedExpression,
    PostfixUnaryExpression,
    PrefixUnaryExpression,
    PrivateIdentifier,
    PrivateIdentifierGetAccessorDeclaration,
    PrivateIdentifierMethodDeclaration,
    PrivateIdentifierPropertyDeclaration,
    PrivateIdentifierSetAccessorDeclaration,
    PropertyAccessExpression,
    PropertyAssignment,
    PropertyDeclaration,
    PropertyName,
    ScriptTarget,
    SetAccessorDeclaration,
    setCommentRange,
    setEmitFlags,
    setInternalEmitFlags,
    setOriginalNode,
    setSourceMapRange,
    setTextRange,
    ShorthandPropertyAssignment,
    skipOuterExpressions,
    skipParentheses,
    some,
    SourceFile,
    SpreadAssignment,
    SpreadElement,
    Statement,
    SyntaxKind,
    TaggedTemplateExpression,
    ThisExpression,
    TransformationContext,
    TransformFlags,
    tryCast,
    VariableDeclaration,
    visitCommaListElements,
    visitEachChild,
    visitIterationBody,
    visitNode,
    visitNodes,
    Visitor,
    VisitResult,
} from "../_namespaces/ts";

// Class/Decorator evaluation order, as it pertains to this transformer:
//
// 1. Class decorators are evaluated outside of the private name scope of the class.
//    - 15.8.20 RS: BindingClassDeclarationEvaluation
//    - 15.8.21 RS: Evaluation
//    - 8.3.5 RS: NamedEvaluation
// 2. ClassHeritage clause is evaluated outside of the private name scope of the class.
//    - 15.8.19 RS: ClassDefinitionEvaluation, Step 8.c.
// 3. The name of the class is assigned.
// 4. For each member:
//    a. Member Decorators are evaluated.
//       - 15.8.19 RS: ClassDefinitionEvaluation, Step 23.
//       - Probably 15.7.13 RS: ClassElementEvaluation, but it's missing from spec text.
//    b. Computed Property name is evaluated
//       - 15.8.19 RS: ClassDefinitionEvaluation, Step 23.
//       - 15.8.15 RS: ClassFieldDefinitionEvaluation, Step 1.
//       - 15.4.5 RS: MethodDefinitionEvaluation, Step 1.
// 5. Static non-field (method/getter/setter/auto-accessor) element decorators are applied
// 6. Non-static non-field (method/getter/setter/auto-accessor) element decorators are applied
// 7. Static field (excl. auto-accessor) element decorators are applied
// 8. Non-static field (excl. auto-accessor) element decorators are applied
// 9. Class decorators are applied
// 10. Class binding is initialized
// 11. Static extra initializers are evaluated
// 12. Static fields are initialized and static blocks are evaluated
// 13. Class extra initializers are evaluated

interface MemberInfo {
    memberDecoratorsName: Identifier; // used in step 4.a
    memberInitializersName?: Identifier; // used in step 12 and construction
    memberDescriptorName?: Identifier;
}

interface ClassInfo {
    class: ClassLikeDeclaration;

    classDecoratorsName?: Identifier; // used in step 2
    classDescriptorName?: Identifier; // used in step 10
    classExtraInitializersName?: Identifier; // used in step 13
    classThis?: Identifier; // `_classThis`, if needed.
    classSuper?: Identifier; // `_classSuper`, if needed.

    memberInfos?: Map<ClassElement, MemberInfo>; // used in step 4.a, 12, and construction

    instanceExtraInitializersName: Identifier | undefined; // used in construction
    staticExtraInitializersName: Identifier | undefined; // used in step 11

    staticNonFieldDecorationStatements?: Statement[];
    nonStaticNonFieldDecorationStatements?: Statement[];
    staticFieldDecorationStatements?: Statement[];
    nonStaticFieldDecorationStatements?: Statement[];

    hasStaticInitializers: boolean;
    hasNonAmbientInstanceFields: boolean;
    hasInjectedInstanceInitializers?: boolean;
    hasStaticPrivateClassElements: boolean;
}

interface ClassLexicalEnvironmentStackEntry {
    kind: "class";
    next: LexicalEnvironmentStackEntry | undefined;
    classInfo: ClassInfo | undefined;
    savedPendingExpressions?: Expression[];
}

interface ClassElementLexicalEnvironmentStackEntry {
    kind: "class-element";
    next: ClassLexicalEnvironmentStackEntry;
    classThis?: Identifier;
    classSuper?: Identifier;
}

interface PropertyNameLexicalEnvironmentStackEntry {
    kind: "name";
    next: ClassElementLexicalEnvironmentStackEntry;
}

interface OtherLexicalEnvironmentStackEntry {
    kind: "other";
    next: LexicalEnvironmentStackEntry | undefined;
    depth: number;
    savedPendingExpressions?: Expression[];
}

type LexicalEnvironmentStackEntry =
    | ClassLexicalEnvironmentStackEntry
    | ClassElementLexicalEnvironmentStackEntry
    | OtherLexicalEnvironmentStackEntry
    | PropertyNameLexicalEnvironmentStackEntry
    ;

/** @internal */
export function transformESDecorators(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle {
    const {
        factory,
        getEmitHelperFactory: emitHelpers,
        startLexicalEnvironment,
        endLexicalEnvironment,
        hoistVariableDeclaration,
    } = context;

    let top: LexicalEnvironmentStackEntry | undefined;
    let classInfo: ClassInfo | undefined;
    let classThis: Identifier | undefined;
    let classSuper: Identifier | undefined;
    let pendingExpressions: Expression[] | undefined;
    let shouldTransformPrivateStaticElementsInFile: boolean;

    return chainBundle(context, transformSourceFile);

    function transformSourceFile(node: SourceFile) {
        top = undefined;
        shouldTransformPrivateStaticElementsInFile = false;
        const visited = visitEachChild(node, visitor, context);
        addEmitHelpers(visited, context.readEmitHelpers());
        if (shouldTransformPrivateStaticElementsInFile) {
            addInternalEmitFlags(visited, InternalEmitFlags.TransformPrivateStaticElements);
            shouldTransformPrivateStaticElementsInFile = false;
        }
        return visited;
    }

    function updateState() {
        classInfo = undefined;
        classThis = undefined;
        classSuper = undefined;
        switch (top?.kind) {
            case "class":
                classInfo = top.classInfo;
                break;
            case "class-element":
                classInfo = top.next.classInfo;
                classThis = top.classThis;
                classSuper = top.classSuper;
                break;
            case "name":
                const grandparent = top.next.next.next;
                if (grandparent?.kind === "class-element") {
                    classInfo = grandparent.next.classInfo;
                    classThis = grandparent.classThis;
                    classSuper = grandparent.classSuper;
                }
                break;
        }
    }

    function enterClass(classInfo: ClassInfo | undefined) {
        top = { kind: "class", next: top, classInfo, savedPendingExpressions: pendingExpressions };
        pendingExpressions = undefined;
        updateState();
    }

    function exitClass() {
        Debug.assert(top?.kind === "class", "Incorrect value for top.kind.", () => `Expected top.kind to be 'class' but got '${top?.kind}' instead.`);
        pendingExpressions = top.savedPendingExpressions;
        top = top.next;
        updateState();
    }

    function enterClassElement(node: ClassElement) {
        Debug.assert(top?.kind === "class", "Incorrect value for top.kind.", () => `Expected top.kind to be 'class' but got '${top?.kind}' instead.`);
        top = { kind: "class-element", next: top };
        if (isClassStaticBlockDeclaration(node) || isPropertyDeclaration(node) && hasStaticModifier(node)) {
            top.classThis = top.next.classInfo?.classThis;
            top.classSuper = top.next.classInfo?.classSuper;
        }
        updateState();
    }

    function exitClassElement() {
        Debug.assert(top?.kind === "class-element", "Incorrect value for top.kind.", () => `Expected top.kind to be 'class-element' but got '${top?.kind}' instead.`);
        Debug.assert(top.next?.kind === "class", "Incorrect value for top.next.kind.", () => `Expected top.next.kind to be 'class' but got '${top!.next?.kind}' instead.`);
        top = top.next;
        updateState();
    }

    function enterName() {
        Debug.assert(top?.kind === "class-element", "Incorrect value for top.kind.", () => `Expected top.kind to be 'class-element' but got '${top?.kind}' instead.`);
        top = { kind: "name", next: top };
        updateState();
    }

    function exitName() {
        Debug.assert(top?.kind === "name", "Incorrect value for top.kind.", () => `Expected top.kind to be 'name' but got '${top?.kind}' instead.`);
        top = top.next;
        updateState();
    }

    function enterOther() {
        if (top?.kind === "other") {
            Debug.assert(!pendingExpressions);
            top.depth++;
        }
        else {
            top = { kind: "other", next: top, depth: 0, savedPendingExpressions: pendingExpressions };
            pendingExpressions = undefined;
            updateState();
        }
    }

    function exitOther() {
        Debug.assert(top?.kind === "other", "Incorrect value for top.kind.", () => `Expected top.kind to be 'other' but got '${top?.kind}' instead.`);
        if (top.depth > 0) {
            Debug.assert(!pendingExpressions);
            top.depth--;
        }
        else {
            pendingExpressions = top.savedPendingExpressions;
            top = top.next;
            updateState();
        }
    }

    function shouldVisitNode(node: Node) {
        return !!(node.transformFlags & TransformFlags.ContainsDecorators)
            || !!classThis && !!(node.transformFlags & TransformFlags.ContainsLexicalThis)
            || !!classThis && !!classSuper && !!(node.transformFlags & TransformFlags.ContainsLexicalSuper);
    }

    function visitor(node: Node): VisitResult<Node> {
        if (!shouldVisitNode(node)) {
            return node;
        }

        switch (node.kind) {
            case SyntaxKind.Decorator: // elided, will be emitted as part of `visitClassDeclaration`
                return Debug.fail("Use `modifierVisitor` instead.");
            case SyntaxKind.ClassDeclaration:
                return visitClassDeclaration(node as ClassDeclaration);
            case SyntaxKind.ClassExpression:
                return visitClassExpression(node as ClassExpression, /*referencedName*/ undefined);
            case SyntaxKind.Constructor:
            case SyntaxKind.PropertyDeclaration:
            case SyntaxKind.ClassStaticBlockDeclaration:
                return Debug.fail("Not supported outside of a class. Use 'classElementVisitor' instead.");
            case SyntaxKind.Parameter:
                return visitParameterDeclaration(node as ParameterDeclaration);

            // Support NamedEvaluation to ensure the correct class name for class expressions.
            case SyntaxKind.BinaryExpression:
                return visitBinaryExpression(node as BinaryExpression, /*discarded*/ false);
            case SyntaxKind.PropertyAssignment:
                return visitPropertyAssignment(node as PropertyAssignment);
            case SyntaxKind.VariableDeclaration:
                return visitVariableDeclaration(node as VariableDeclaration);
            case SyntaxKind.BindingElement:
                return visitBindingElement(node as BindingElement);
            case SyntaxKind.ExportAssignment:
                return visitExportAssignment(node as ExportAssignment);
            case SyntaxKind.ThisKeyword:
                return visitThisExpression(node as ThisExpression);
            case SyntaxKind.ForStatement:
                return visitForStatement(node as ForStatement);
            case SyntaxKind.ExpressionStatement:
                return visitExpressionStatement(node as ExpressionStatement);
            case SyntaxKind.CommaListExpression:
                return visitCommaListExpression(node as CommaListExpression, /*discarded*/ false);
            case SyntaxKind.ParenthesizedExpression:
                return visitParenthesizedExpression(node as ParenthesizedExpression, /*discarded*/ false, /*referencedName*/ undefined);
            case SyntaxKind.PartiallyEmittedExpression:
                return visitPartiallyEmittedExpression(node as PartiallyEmittedExpression, /*discarded*/ false, /*referencedName*/ undefined);
            case SyntaxKind.CallExpression:
                return visitCallExpression(node as CallExpression);
            case SyntaxKind.TaggedTemplateExpression:
                return visitTaggedTemplateExpression(node as TaggedTemplateExpression);
            case SyntaxKind.PrefixUnaryExpression:
            case SyntaxKind.PostfixUnaryExpression:
                return visitPreOrPostfixUnaryExpression(node as PrefixUnaryExpression | PostfixUnaryExpression, /*discarded*/ false);
            case SyntaxKind.PropertyAccessExpression:
                return visitPropertyAccessExpression(node as PropertyAccessExpression);
            case SyntaxKind.ElementAccessExpression:
                return visitElementAccessExpression(node as ElementAccessExpression);
            case SyntaxKind.ComputedPropertyName:
                return visitComputedPropertyName(node as ComputedPropertyName);

            case SyntaxKind.MethodDeclaration: // object literal methods and accessors
            case SyntaxKind.SetAccessor:
            case SyntaxKind.GetAccessor:
            case SyntaxKind.FunctionExpression:
            case SyntaxKind.FunctionDeclaration: {
                enterOther();
                const result = visitEachChild(node, fallbackVisitor, context);
                exitOther();
                return result;
            }

            default:
                return visitEachChild(node, fallbackVisitor, context);
        }
    }

    function fallbackVisitor(node: Node): VisitResult<Node | undefined> {
        switch (node.kind) {
            case SyntaxKind.Decorator:
                return undefined;
            default:
                return visitor(node);
        }
    }

    function modifierVisitor(node: ModifierLike): VisitResult<Modifier | undefined> {
        switch (node.kind) {
            case SyntaxKind.Decorator: // elided, will be emitted as part of `visitClassDeclaration`
                return undefined;
            default:
                return node;
        }
    }

    function classElementVisitor(node: Node) {
        switch (node.kind) {
            case SyntaxKind.Constructor:
                return visitConstructorDeclaration(node as ConstructorDeclaration);
            case SyntaxKind.MethodDeclaration:
                return visitMethodDeclaration(node as MethodDeclaration);
            case SyntaxKind.GetAccessor:
                return visitGetAccessorDeclaration(node as GetAccessorDeclaration);
            case SyntaxKind.SetAccessor:
                return visitSetAccessorDeclaration(node as SetAccessorDeclaration);
            case SyntaxKind.PropertyDeclaration:
                return visitPropertyDeclaration(node as PropertyDeclaration);
            case SyntaxKind.ClassStaticBlockDeclaration:
                return visitClassStaticBlockDeclaration(node as ClassStaticBlockDeclaration);
            default:
                return visitor(node);
        }
    }

    function namedEvaluationVisitor(node: Node, referencedName: Expression): VisitResult<Node> {
        switch (node.kind) {
            case SyntaxKind.PartiallyEmittedExpression:
                return visitPartiallyEmittedExpression(node as PartiallyEmittedExpression, /*discarded*/ false, referencedName);
            case SyntaxKind.ParenthesizedExpression:
                return visitParenthesizedExpression(node as ParenthesizedExpression, /*discarded*/ false, referencedName);
            case SyntaxKind.ClassExpression:
                return visitClassExpression(node as ClassExpression, referencedName);
            default:
                return visitor(node);
        }
    }

    function discardedValueVisitor(node: Node): VisitResult<Node> {
        switch (node.kind) {
            case SyntaxKind.PrefixUnaryExpression:
            case SyntaxKind.PostfixUnaryExpression:
                return visitPreOrPostfixUnaryExpression(node as PrefixUnaryExpression | PostfixUnaryExpression, /*discarded*/ true);
            case SyntaxKind.BinaryExpression:
                return visitBinaryExpression(node as BinaryExpression, /*discarded*/ true);
            case SyntaxKind.CommaListExpression:
                return visitCommaListExpression(node as CommaListExpression, /*discarded*/ true);
            case SyntaxKind.ParenthesizedExpression:
                return visitParenthesizedExpression(node as ParenthesizedExpression, /*discarded*/ true, /*referencedName*/ undefined);
            default:
                return visitor(node);
        }
    }

    function getHelperVariableName(node: ClassLikeDeclaration | ClassElement) {
        let declarationName =
            node.name && isIdentifier(node.name) && !isGeneratedIdentifier(node.name) ? idText(node.name) :
            node.name && isPrivateIdentifier(node.name) && !isGeneratedIdentifier(node.name) ? idText(node.name).slice(1) :
            node.name && isStringLiteral(node.name) && isIdentifierText(node.name.text, ScriptTarget.ESNext) ? node.name.text :
            isClassLike(node) ? "class" : "member";
        if (isGetAccessor(node)) declarationName = `get_${declarationName}`;
        if (isSetAccessor(node)) declarationName = `set_${declarationName}`;
        if (node.name && isPrivateIdentifier(node.name)) declarationName = `private_${declarationName}`;
        if (isStatic(node)) declarationName = `static_${declarationName}`;
        return "_" + declarationName;
    }

    function createHelperVariable(node: ClassLikeDeclaration | ClassElement, suffix: string) {
        return factory.createUniqueName(`${getHelperVariableName(node)}_${suffix}`, GeneratedIdentifierFlags.Optimistic | GeneratedIdentifierFlags.ReservedInNestedScopes);
    }

    function createLet(name: Identifier, initializer?: Expression) {
        return factory.createVariableStatement(
            /*modifiers*/ undefined,
            factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                    name,
                    /*exclamationToken*/ undefined,
                    /*type*/ undefined,
                    initializer
                ),
            ], NodeFlags.Let)
        );
    }

    function createClassInfo(node: ClassLikeDeclaration): ClassInfo {
        let instanceExtraInitializersName: Identifier | undefined;
        let staticExtraInitializersName: Identifier | undefined;
        let hasStaticInitializers = false;
        let hasNonAmbientInstanceFields = false;
        let hasStaticPrivateClassElements = false;

        // Before visiting we perform a first pass to collect information we'll need
        // as we descend.

        for (const member of node.members) {
            if (isNamedClassElement(member) && nodeOrChildIsDecorated(/*useLegacyDecorators*/ false, member, node)) {
                if (hasStaticModifier(member)) {
                    staticExtraInitializersName ??= factory.createUniqueName("_staticExtraInitializers", GeneratedIdentifierFlags.Optimistic);
                }
                else {
                    instanceExtraInitializersName ??= factory.createUniqueName("_instanceExtraInitializers", GeneratedIdentifierFlags.Optimistic);
                }
            }
            if (isClassStaticBlockDeclaration(member)) {
                hasStaticInitializers = true;
            }
            else if (isPropertyDeclaration(member)) {
                if (hasStaticModifier(member)) {
                    hasStaticInitializers ||= (!!member.initializer || hasDecorators(member));
                }
                else {
                    hasNonAmbientInstanceFields ||= !isAmbientPropertyDeclaration(member);
                }
            }

            if ((isPrivateIdentifierClassElementDeclaration(member) || isAutoAccessorPropertyDeclaration(member)) && hasStaticModifier(member)) {
                hasStaticPrivateClassElements = true;
            }

            // exit early if possible
            if (staticExtraInitializersName &&
                instanceExtraInitializersName &&
                hasStaticInitializers &&
                hasNonAmbientInstanceFields &&
                hasStaticPrivateClassElements) {
                break;
            }
        }

        return {
            class: node,
            instanceExtraInitializersName,
            staticExtraInitializersName,
            hasStaticInitializers,
            hasNonAmbientInstanceFields,
            hasStaticPrivateClassElements,
        };
    }

    function containsLexicalSuperInStaticInitializer(node: ClassLikeDeclaration) {
        for (const member of node.members) {
            if (isClassStaticBlockDeclaration(member) ||
                isPropertyDeclaration(member) && hasStaticModifier(member)) {
                if (member.transformFlags & TransformFlags.ContainsLexicalSuper) {
                    return true;
                }
            }
        }
        return false;
    }

    function transformClassLike(node: ClassLikeDeclaration, className: Expression) {
        startLexicalEnvironment();

        const classReference = node.name ?? factory.getGeneratedNameForNode(node);
        const classInfo = createClassInfo(node);
        const classDefinitionStatements: Statement[] = [];
        let leadingBlockStatements: Statement[] | undefined;
        let trailingBlockStatements: Statement[] | undefined;
        let syntheticConstructor: ConstructorDeclaration | undefined;
        let heritageClauses: NodeArray<HeritageClause> | undefined;
        let shouldTransformPrivateStaticElementsInClass = false;

        // 1. Class decorators are evaluated outside of the private name scope of the class.
        const classDecorators = transformAllDecoratorsOfDeclaration(getAllDecoratorsOfClass(node));
        if (classDecorators) {
            // - Since class decorators don't have privileged access to private names defined inside the class,
            //   they must be evaluated outside of the class body.
            // - Since a class decorator can replace the class constructor, we must define a variable to keep track
            //   of the mutated class.
            // - Since a class decorator can add extra initializers, we must define a variable to keep track of
            //   extra initializers.
            classInfo.classDecoratorsName = factory.createUniqueName("_classDecorators", GeneratedIdentifierFlags.Optimistic);
            classInfo.classDescriptorName = factory.createUniqueName("_classDescriptor", GeneratedIdentifierFlags.Optimistic);
            classInfo.classExtraInitializersName = factory.createUniqueName("_classExtraInitializers", GeneratedIdentifierFlags.Optimistic);
            classInfo.classThis = factory.createUniqueName("_classThis", GeneratedIdentifierFlags.Optimistic);
            classDefinitionStatements.push(
                createLet(classInfo.classDecoratorsName, factory.createArrayLiteralExpression(classDecorators)),
                createLet(classInfo.classDescriptorName),
                createLet(classInfo.classExtraInitializersName, factory.createArrayLiteralExpression()),
                createLet(classInfo.classThis),
            );

            if (classInfo.hasStaticPrivateClassElements) {
                shouldTransformPrivateStaticElementsInClass = true;
                shouldTransformPrivateStaticElementsInFile = true;
            }
        }

        // Rewrite `super` in static initializers so that we can use the correct `this`.
        if (classDecorators && containsLexicalSuperInStaticInitializer(node)) {
            const extendsClause = getHeritageClause(node.heritageClauses, SyntaxKind.ExtendsKeyword);
            const extendsElement = extendsClause && firstOrUndefined(extendsClause.types);
            const extendsExpression = extendsElement && visitNode(extendsElement.expression, visitor, isExpression);
            if (extendsExpression) {
                classInfo.classSuper = factory.createUniqueName("_classSuper", GeneratedIdentifierFlags.Optimistic);

                // Ensure we do not give the class or function an assigned name due to the variable by prefixing it
                // with `0, `.
                const unwrapped = skipOuterExpressions(extendsExpression);
                const safeExtendsExpression =
                    isClassExpression(unwrapped) && !unwrapped.name ||
                    isFunctionExpression(unwrapped) && !unwrapped.name ||
                    isArrowFunction(unwrapped) ?
                        factory.createComma(factory.createNumericLiteral(0), extendsExpression) :
                        extendsExpression;
                classDefinitionStatements.push(createLet(classInfo.classSuper, safeExtendsExpression));
                const updatedExtendsElement = factory.updateExpressionWithTypeArguments(extendsElement, classInfo.classSuper, /*typeArguments*/ undefined);
                const updatedExtendsClause = factory.updateHeritageClause(extendsClause, [updatedExtendsElement]);
                heritageClauses = factory.createNodeArray([updatedExtendsClause]);
            }
        }
        else {
            // 2. ClassHeritage clause is evaluated outside of the private name scope of the class.
            heritageClauses = visitNodes(node.heritageClauses, visitor, isHeritageClause);
        }

        const renamedClassThis = classInfo.classThis ?? factory.createThis();

        // 3. The name of the class is assigned.
        //
        // If the class did not have a name, set the assigned name as if from NamedEvaluation.
        // We don't need to use the assigned name if it consists of the empty string and the transformed class
        // expression won't get its name from any other source (such as the variable we create to handle
        // class decorators)
        const needsSetNameHelper = !getOriginalNode(node, isClassLike)?.name && (classDecorators || !isStringLiteral(className) || !isEmptyStringLiteral(className));
        if (needsSetNameHelper) {
            const setNameExpr = emitHelpers().createSetFunctionNameHelper(factory.createThis(), className);
            leadingBlockStatements = append(leadingBlockStatements, factory.createExpressionStatement(setNameExpr));
        }

        // 4. For each member:
        //    a. Member Decorators are evaluated
        //    b. Computed Property Name is evaluated, if present

        // We visit members in two passes:
        // - The first pass visits methods, accessors, and fields to collect decorators and computed property names.
        // - The second pass visits the constructor to add instance initializers.
        //
        // NOTE: If there are no constructors, but there are instance initializers, a synthetic constructor is added.

        enterClass(classInfo);
        let members = visitNodes(node.members, classElementVisitor, isClassElement);
        if (pendingExpressions) {
            let outerThis: Identifier | undefined;
            for (let expression of pendingExpressions) {
                // If a pending expression contains a lexical `this`, we'll need to capture the lexical `this` of the
                // container and transform it in the expression. This ensures we use the correct `this` in the resulting
                // class `static` block. We don't use substitution here because the size of the tree we are visiting
                // is likely to be small and doesn't justify the complexity of introducing substitution.
                expression = visitNode(expression, function thisVisitor(node: Node): Node {
                    if (!(node.transformFlags & TransformFlags.ContainsLexicalThis)) {
                        return node;
                    }

                    switch (node.kind) {
                        case SyntaxKind.ThisKeyword:
                            if (!outerThis) {
                                outerThis = factory.createUniqueName("_outerThis", GeneratedIdentifierFlags.Optimistic);
                                classDefinitionStatements.unshift(createLet(outerThis, factory.createThis()));
                            }
                            return outerThis;

                        default:
                            return visitEachChild(node, thisVisitor, context);
                    }
                }, isExpression);

                const statement = factory.createExpressionStatement(expression);
                leadingBlockStatements = append(leadingBlockStatements, statement);
            }
            pendingExpressions = undefined;
        }
        exitClass();

        if (classInfo.instanceExtraInitializersName && !getFirstConstructorWithBody(node)) {
            const initializerStatements = prepareConstructor(node, classInfo);
            if (initializerStatements) {
                const extendsClauseElement = getEffectiveBaseTypeNode(node);
                const isDerivedClass = !!(extendsClauseElement && skipOuterExpressions(extendsClauseElement.expression).kind !== SyntaxKind.NullKeyword);
                const constructorStatements: Statement[] = [];
                if (isDerivedClass) {
                    const spreadArguments = factory.createSpreadElement(factory.createIdentifier("arguments"));
                    const superCall = factory.createCallExpression(factory.createSuper(), /*typeArguments*/ undefined, [spreadArguments]);
                    constructorStatements.push(factory.createExpressionStatement(superCall));
                }

                addRange(constructorStatements, initializerStatements);

                const constructorBody = factory.createBlock(constructorStatements, /*multiLine*/ true);
                syntheticConstructor = factory.createConstructorDeclaration(/*modifiers*/ undefined, [], constructorBody);
            }
        }

        // Used in steps 5, 7, and 11
        if (classInfo.staticExtraInitializersName) {
            classDefinitionStatements.push(
                createLet(classInfo.staticExtraInitializersName, factory.createArrayLiteralExpression())
            );
        }

        // Used in steps 6, 8, and during construction
        if (classInfo.instanceExtraInitializersName) {
            classDefinitionStatements.push(
                createLet(classInfo.instanceExtraInitializersName, factory.createArrayLiteralExpression())
            );
        }

        // Used in steps 7, 8, 12, and construction
        if (classInfo.memberInfos) {
            forEachEntry(classInfo.memberInfos, (memberInfo, member) => {
                if (isStatic(member)) {
                    classDefinitionStatements.push(createLet(memberInfo.memberDecoratorsName));
                    if (memberInfo.memberInitializersName) {
                        classDefinitionStatements.push(createLet(memberInfo.memberInitializersName, factory.createArrayLiteralExpression()));
                    }
                    if (memberInfo.memberDescriptorName) {
                        classDefinitionStatements.push(createLet(memberInfo.memberDescriptorName));
                    }
                }
            });
        }

        // Used in steps 7, 8, 12, and construction
        if (classInfo.memberInfos) {
            forEachEntry(classInfo.memberInfos, (memberInfo, member) => {
                if (!isStatic(member)) {
                    classDefinitionStatements.push(createLet(memberInfo.memberDecoratorsName));
                    if (memberInfo.memberInitializersName) {
                        classDefinitionStatements.push(createLet(memberInfo.memberInitializersName, factory.createArrayLiteralExpression()));
                    }
                    if (memberInfo.memberDescriptorName) {
                        classDefinitionStatements.push(createLet(memberInfo.memberDescriptorName));
                    }
                }
            });
        }

        // 5. Static non-field element decorators are applied
        leadingBlockStatements = addRange(leadingBlockStatements, classInfo.staticNonFieldDecorationStatements);

        // 6. Non-static non-field element decorators are applied
        leadingBlockStatements = addRange(leadingBlockStatements, classInfo.nonStaticNonFieldDecorationStatements);

        // 7. Static field element decorators are applied
        leadingBlockStatements = addRange(leadingBlockStatements, classInfo.staticFieldDecorationStatements);

        // 8. Non-static field element decorators are applied
        leadingBlockStatements = addRange(leadingBlockStatements, classInfo.nonStaticFieldDecorationStatements);

        // 9. Class decorators are applied
        // 10. Class binding is initialized
        if (classInfo.classDescriptorName && classInfo.classDecoratorsName && classInfo.classExtraInitializersName && classInfo.classThis) {
            leadingBlockStatements ??= [];

            //  __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, _classExtraInitializers);
            const valueProperty = factory.createPropertyAssignment("value", factory.createThis());
            const classDescriptor = factory.createObjectLiteralExpression([valueProperty]);
            const classDescriptorAssignment = factory.createAssignment(classInfo.classDescriptorName, classDescriptor);
            const classNameReference = factory.createPropertyAccessExpression(factory.createThis(), "name");
            const esDecorateHelper = emitHelpers().createESDecorateHelper(
                factory.createNull(),
                classDescriptorAssignment,
                classInfo.classDecoratorsName,
                { kind: "class", name: classNameReference },
                factory.createNull(),
                classInfo.classExtraInitializersName
            );
            const esDecorateStatement = factory.createExpressionStatement(esDecorateHelper);
            setSourceMapRange(esDecorateStatement, moveRangePastDecorators(node));
            leadingBlockStatements.push(esDecorateStatement);

            //  C = _classThis = _classDescriptor.value;
            const classDescriptorValueReference = factory.createPropertyAccessExpression(classInfo.classDescriptorName, "value");
            const classThisAssignment = factory.createAssignment(classInfo.classThis, classDescriptorValueReference);
            const classReferenceAssignment = factory.createAssignment(classReference, classThisAssignment);
            leadingBlockStatements.push(factory.createExpressionStatement(classReferenceAssignment));
        }

        // 11. Static extra initializers are evaluated
        if (classInfo.staticExtraInitializersName) {
            const runStaticInitializersHelper = emitHelpers().createRunInitializersHelper(renamedClassThis, classInfo.staticExtraInitializersName);
            const runStaticInitializersStatement = factory.createExpressionStatement(runStaticInitializersHelper);
            setSourceMapRange(runStaticInitializersStatement, node.name ?? moveRangePastDecorators(node));
            leadingBlockStatements = append(leadingBlockStatements, runStaticInitializersStatement);
        }

        // 12. Static fields are initialized and static blocks are evaluated

        // 13. Class extra initializers are evaluated
        if (classInfo.classExtraInitializersName) {
            const runClassInitializersHelper = emitHelpers().createRunInitializersHelper(renamedClassThis, classInfo.classExtraInitializersName);
            const runClassInitializersStatement = factory.createExpressionStatement(runClassInitializersHelper);
            setSourceMapRange(runClassInitializersStatement, node.name ?? moveRangePastDecorators(node));
            trailingBlockStatements = append(trailingBlockStatements, runClassInitializersStatement);
        }

        // If there are no other static initializers to run, combine the leading and trailing block statements
        if (leadingBlockStatements && trailingBlockStatements && !classInfo.hasStaticInitializers) {
            addRange(leadingBlockStatements, trailingBlockStatements);
            trailingBlockStatements = undefined;
        }

        let newMembers: readonly ClassElement[] = members;

        // insert a leading `static {}` block, if necessary
        if (leadingBlockStatements) {
            //  class C {
            //      static { ... }
            //      ...
            //  }
            const leadingStaticBlockBody = factory.createBlock(leadingBlockStatements, /*multiLine*/ true);
            const leadingStaticBlock = factory.createClassStaticBlockDeclaration(leadingStaticBlockBody);
            if (shouldTransformPrivateStaticElementsInClass) {
                // We use `InternalEmitFlags.TransformPrivateStaticElements` as a marker on a class static block
                // to inform the classFields transform that it shouldn't rename `this` to `_classThis` in the
                // transformed class static block.
                setInternalEmitFlags(leadingStaticBlock, InternalEmitFlags.TransformPrivateStaticElements);
            }
            newMembers = [leadingStaticBlock, ...newMembers];
        }

        // append the synthetic constructor, if necessary
        if (syntheticConstructor) {
            newMembers = [...newMembers, syntheticConstructor];
        }

        // append a trailing `static {}` block, if necessary
        if (trailingBlockStatements) {
            //  class C {
            //      ...
            //      static { ... }
            //  }
            const trailingStaticBlockBody = factory.createBlock(trailingBlockStatements, /*multiLine*/ true);
            const trailingStaticBlock = factory.createClassStaticBlockDeclaration(trailingStaticBlockBody);
            newMembers = [...newMembers, trailingStaticBlock];
        }

        // Update members with newly added members.
        if (newMembers !== members) {
            members = setTextRange(factory.createNodeArray(newMembers), members);
        }

        const lexicalEnvironment = endLexicalEnvironment();
        let classExpression: ClassExpression;
        if (classDecorators) {
            // We use `var` instead of `let` so we can leverage NamedEvaluation to define the class name
            // and still be able to ensure it is initialized prior to any use in `static {}`.

            //  (() => {
            //      let _classDecorators = [...];
            //      let _classDescriptor;
            //      let _classExtraInitializers = [];
            //      let _classThis;
            //      ...
            //      var C = class {
            //          static {
            //              __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, ...);
            //              // `C` is initialized here
            //              C = _classThis = _classDescriptor.value;
            //          }
            //          static x = 1;
            //          static y = C.x; // `C` will already be defined here.
            //          static { ... }
            //      };
            //      return C;
            //  })();

            classExpression = factory.createClassExpression(/*modifiers*/ undefined, /*name*/ undefined, /*typeParameters*/ undefined, heritageClauses, members);
            const classReferenceDeclaration = factory.createVariableDeclaration(classReference, /*exclamationToken*/ undefined, /*type*/ undefined, classExpression);
            const classReferenceVarDeclList = factory.createVariableDeclarationList([classReferenceDeclaration]);
            const returnExpr = classInfo.classThis ? factory.createAssignment(classReference, classInfo.classThis) : classReference;
            classDefinitionStatements.push(
                factory.createVariableStatement(/*modifiers*/ undefined, classReferenceVarDeclList),
                factory.createReturnStatement(returnExpr),
            );
        }
        else {
            //  return <classExpression>;
            classExpression = factory.createClassExpression(/*modifiers*/ undefined, node.name, /*typeParameters*/ undefined, heritageClauses, members);
            classDefinitionStatements.push(factory.createReturnStatement(classExpression));
        }

        if (shouldTransformPrivateStaticElementsInClass) {
            addInternalEmitFlags(classExpression, InternalEmitFlags.TransformPrivateStaticElements);
            for (const member of classExpression.members) {
                if ((isPrivateIdentifierClassElementDeclaration(member) || isAutoAccessorPropertyDeclaration(member)) && hasStaticModifier(member)) {
                    addInternalEmitFlags(member, InternalEmitFlags.TransformPrivateStaticElements);
                }
            }
        }

        setOriginalNode(classExpression, node);
        getOrCreateEmitNode(classExpression).classThis = classInfo.classThis;
        return factory.createImmediatelyInvokedArrowFunction(factory.mergeLexicalEnvironment(classDefinitionStatements, lexicalEnvironment));
    }

    function isDecoratedClassLike(node: ClassLikeDeclaration) {
        return classOrConstructorParameterIsDecorated(/*useLegacyDecorators*/ false, node) ||
            childIsDecorated(/*useLegacyDecorators*/ false, node);
    }

    function visitClassDeclaration(node: ClassDeclaration): VisitResult<Statement> {
        if (isDecoratedClassLike(node)) {
            if (hasSyntacticModifier(node, ModifierFlags.Export) &&
                hasSyntacticModifier(node, ModifierFlags.Default)) {
                //  export default (() => { ... })();
                const originalClass = getOriginalNode(node, isClassLike) ?? node;
                const className = originalClass.name ? factory.createStringLiteralFromNode(originalClass.name) : factory.createStringLiteral("default");
                const iife = transformClassLike(node, className);
                const statement = factory.createExportDefault(iife);
                setOriginalNode(statement, node);
                setCommentRange(statement, getCommentRange(node));
                setSourceMapRange(statement, moveRangePastDecorators(node));
                return statement;
            }
            else {
                //  let C = (() => { ... })();
                Debug.assertIsDefined(node.name, "A class declaration that is not a default export must have a name.");
                const iife = transformClassLike(node, factory.createStringLiteralFromNode(node.name));
                const modifiers = visitNodes(node.modifiers, modifierVisitor, isModifier);
                const varDecl = factory.createVariableDeclaration(node.name, /*exclamationToken*/ undefined, /*type*/ undefined, iife);
                const varDecls = factory.createVariableDeclarationList([varDecl], NodeFlags.Let);
                const statement = factory.createVariableStatement(modifiers, varDecls);
                setOriginalNode(statement, node);
                setCommentRange(statement, getCommentRange(node));
                return statement;
            }
        }
        else {
            const modifiers = visitNodes(node.modifiers, modifierVisitor, isModifier);
            const heritageClauses = visitNodes(node.heritageClauses, visitor, isHeritageClause);
            enterClass(/*classInfo*/ undefined);
            const members = visitNodes(node.members, classElementVisitor, isClassElement);
            exitClass();
            return factory.updateClassDeclaration(node, modifiers, node.name, /*typeParameters*/ undefined, heritageClauses, members);
        }
    }

    function visitClassExpression(node: ClassExpression, referencedName: Expression | undefined) {
        if (isDecoratedClassLike(node)) {
            const className = node.name ? factory.createStringLiteralFromNode(node.name) : referencedName ?? factory.createStringLiteral("");
            const iife = transformClassLike(node, className);
            setOriginalNode(iife, node);
            return iife;
        }
        else {
            const modifiers = visitNodes(node.modifiers, modifierVisitor, isModifier);
            const heritageClauses = visitNodes(node.heritageClauses, visitor, isHeritageClause);
            enterClass(/*classInfo*/ undefined);
            const members = visitNodes(node.members, classElementVisitor, isClassElement);
            exitClass();
            return factory.updateClassExpression(node, modifiers, node.name, /*typeParameters*/ undefined, heritageClauses, members);
        }
    }

    function prepareConstructor(_parent: ClassLikeDeclaration, classInfo: ClassInfo) {
        // Decorated instance members can add "extra" initializers to the instance. If a class contains any instance
        // fields, we'll inject the `__runInitializers()` call for these extra initializers into the initializer of
        // the first class member that will be initialized. However, if the class does not contain any fields that
        // we can piggyback on, we need to synthesize a `__runInitializers()` call in the constructor instead.
        if (classInfo.instanceExtraInitializersName && !classInfo.hasNonAmbientInstanceFields) {
            // If there are instance extra initializers we need to add them to the body along with any
            // field initializers
            const statements: Statement[] = [];

            statements.push(
                factory.createExpressionStatement(
                    emitHelpers().createRunInitializersHelper(
                        factory.createThis(),
                        classInfo.instanceExtraInitializersName
                    )
                )
            );

            return statements;
        }
    }

    function visitConstructorDeclaration(node: ConstructorDeclaration) {
        enterClassElement(node);
        const modifiers = visitNodes(node.modifiers, modifierVisitor, isModifier);
        const parameters = visitNodes(node.parameters, visitor, isParameter);
        let body: Block | undefined;
        if (node.body && classInfo) {
            // If there are instance extra initializers we need to add them to the body along with any
            // field initializers
            const initializerStatements = prepareConstructor(classInfo.class, classInfo);
            if (initializerStatements) {
                const statements: Statement[] = [];
                const nonPrologueStart = factory.copyPrologue(node.body.statements, statements, /*ensureUseStrict*/ false, visitor);
                const superStatementIndex = findSuperStatementIndex(node.body.statements, nonPrologueStart);
                if (superStatementIndex >= 0) {
                    addRange(statements, visitNodes(node.body.statements, visitor, isStatement, nonPrologueStart, superStatementIndex + 1 - nonPrologueStart));
                    addRange(statements, initializerStatements);
                    addRange(statements, visitNodes(node.body.statements, visitor, isStatement, superStatementIndex + 1));
                }
                else {
                    addRange(statements, initializerStatements);
                    addRange(statements, visitNodes(node.body.statements, visitor, isStatement));
                }
                body = factory.createBlock(statements, /*multiLine*/ true);
                setOriginalNode(body, node.body);
                setTextRange(body, node.body);
            }
        }

        body ??= visitNode(node.body, visitor, isBlock);
        exitClassElement();
        return factory.updateConstructorDeclaration(node, modifiers, parameters, body);
    }

    function finishClassElement(updated: ClassElement, original: ClassElement) {
        if (updated !== original) {
            // While we emit the source map for the node after skipping decorators and modifiers,
            // we need to emit the comments for the original range.
            setCommentRange(updated, original);
            setSourceMapRange(updated, moveRangePastDecorators(original));
        }
        return updated;
    }

    function partialTransformClassElement<
        TNode extends MethodDeclaration | PropertyDeclaration | GetAccessorDeclaration | SetAccessorDeclaration,
    >(
        member: TNode,
        useNamedEvaluation: boolean,
        classInfo: ClassInfo | undefined,
        createDescriptor?: (node: TNode & { readonly name: PrivateIdentifier }, modifiers: ModifiersArray | undefined) => Expression
    ) {
        let referencedName: Expression | undefined;
        let name: PropertyName | undefined;
        let initializersName: Identifier | undefined;
        let thisArg: Identifier | undefined;
        let descriptorName: Identifier | undefined;
        if (!classInfo) {
            const modifiers = visitNodes(member.modifiers, modifierVisitor, isModifier);
            enterName();
            if (useNamedEvaluation) {
                ({ referencedName, name } = visitReferencedPropertyName(member.name));
            }
            else {
                name = visitPropertyName(member.name);
            }
            exitName();
            return { modifiers, referencedName, name, initializersName, descriptorName, thisArg };
        }

        // Member decorators require privileged access to private names. However, computed property
        // evaluation occurs interspersed with decorator evaluation. This means that if we encounter
        // a computed property name we must inline decorator evaluation.
        const memberDecorators = transformAllDecoratorsOfDeclaration(getAllDecoratorsOfClassElement(member, classInfo.class, /*useLegacyDecorators*/ false));
        const modifiers = visitNodes(member.modifiers, modifierVisitor, isModifier);

        if (memberDecorators) {
            const memberDecoratorsName = createHelperVariable(member, "decorators");
            const memberDecoratorsArray = factory.createArrayLiteralExpression(memberDecorators);
            const memberDecoratorsAssignment = factory.createAssignment(memberDecoratorsName, memberDecoratorsArray);
            const memberInfo: MemberInfo = { memberDecoratorsName };
            classInfo.memberInfos ??= new Map();
            classInfo.memberInfos.set(member, memberInfo);
            pendingExpressions ??= [];
            pendingExpressions.push(memberDecoratorsAssignment);

            // 5. Static non-field (method/getter/setter/auto-accessor) element decorators are applied
            // 6. Non-static non-field (method/getter/setter/auto-accessor) element decorators are applied
            // 7. Static field (excl. auto-accessor) element decorators are applied
            // 8. Non-static field (excl. auto-accessor) element decorators are applied
            const statements =
                isMethodOrAccessor(member) || isAutoAccessorPropertyDeclaration(member) ?
                    isStatic(member) ?
                        classInfo.staticNonFieldDecorationStatements ??= [] :
                        classInfo.nonStaticNonFieldDecorationStatements ??= [] :
                isPropertyDeclaration(member) && !isAutoAccessorPropertyDeclaration(member) ?
                    isStatic(member) ?
                        classInfo.staticFieldDecorationStatements ??= [] :
                        classInfo.nonStaticFieldDecorationStatements ??= [] :
                Debug.fail();

            const kind =
                isGetAccessorDeclaration(member) ? "getter" :
                isSetAccessorDeclaration(member) ? "setter" :
                isMethodDeclaration(member) ? "method" :
                isAutoAccessorPropertyDeclaration(member) ? "accessor" :
                isPropertyDeclaration(member) ? "field" :
                Debug.fail();

            let propertyName: ESDecorateName;
            if (isIdentifier(member.name) || isPrivateIdentifier(member.name)) {
                propertyName = { computed: false, name: member.name };
            }
            else if (isPropertyNameLiteral(member.name)) {
                propertyName = { computed: true, name: factory.createStringLiteralFromNode(member.name) };
            }
            else {
                const expression = member.name.expression;
                if (isPropertyNameLiteral(expression) && !isIdentifier(expression)) {
                    propertyName = { computed: true, name: factory.createStringLiteralFromNode(expression) };
                }
                else {
                    enterName();
                    ({ referencedName, name } = visitReferencedPropertyName(member.name));
                    propertyName = { computed: true, name: referencedName };
                    exitName();
                }
            }

            const context: ESDecorateClassElementContext = {
                kind,
                name: propertyName,
                static: isStatic(member),
                private: isPrivateIdentifier(member.name),
                access: {
                    // 15.7.3 CreateDecoratorAccessObject (kind, name)
                    // 2. If _kind_ is ~field~, ~method~, ~accessor~, or ~getter~, then ...
                    get: isPropertyDeclaration(member) || isGetAccessorDeclaration(member) || isMethodDeclaration(member),
                    // 3. If _kind_ is ~field~, ~accessor~, or ~setter~, then ...
                    set: isPropertyDeclaration(member) || isSetAccessorDeclaration(member)
                },
            };

            const extraInitializers = isStatic(member) ?
                classInfo.staticExtraInitializersName ??= factory.createUniqueName("_staticExtraInitializers", GeneratedIdentifierFlags.Optimistic) :
                classInfo.instanceExtraInitializersName ??= factory.createUniqueName("_instanceExtraInitializers", GeneratedIdentifierFlags.Optimistic);

            if (isMethodOrAccessor(member)) {
                // __esDecorate(this, null, _static_member_decorators, { kind: "method", name: "...", static: true, private: false, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, null, _member_decorators, { kind: "method", name: "...", static: false, private: false, access: { ... } }, _instanceExtraInitializers);
                // __esDecorate(this, null, _static_member_decorators, { kind: "getter", name: "...", static: true, private: false, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, null, _member_decorators, { kind: "getter", name: "...", static: false, private: false, access: { ... } }, _instanceExtraInitializers);
                // __esDecorate(this, null, _static_member_decorators, { kind: "setter", name: "...", static: true, private: false, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, null, _member_decorators, { kind: "setter", name: "...", static: false, private: false, access: { ... } }, _instanceExtraInitializers);

                // __esDecorate(this, _static_member_descriptor = { value() { ... } }, _static_member_decorators, { kind: "method", name: "...", static: true, private: true, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, _member_descriptor = { value() { ... } }, _member_decorators, { kind: "method", name: "...", static: false, private: true, access: { ... } }, _instanceExtraInitializers);
                // __esDecorate(this, _static_member_descriptor = { get() { ... } }, _static_member_decorators, { kind: "getter", name: "...", static: true, private: true, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, _member_descriptor = { get() { ... } }, _member_decorators, { kind: "getter", name: "...", static: false, private: true, access: { ... } }, _instanceExtraInitializers);
                // __esDecorate(this, _static_member_descriptor = { set() { ... } }, _static_member_decorators, { kind: "setter", name: "...", static: true, private: true, access: { ... } }, _staticExtraInitializers);
                // __esDecorate(this, _member_descriptor = { set() { ... } }, _member_decorators, { kind: "setter", name: "...", static: false, private: true, access: { ... } }, _instanceExtraInitializers);

                let descriptor: Expression | undefined;
                if (isPrivateIdentifierClassElementDeclaration(member) && createDescriptor) {
                    descriptor = createDescriptor(member, visitNodes(modifiers, node => tryCast(node, isAsyncModifier), isModifier));
                    memberInfo.memberDescriptorName = descriptorName = createHelperVariable(member, "descriptor");
                    descriptor = factory.createAssignment(descriptorName, descriptor);
                }

                const esDecorateExpression = emitHelpers().createESDecorateHelper(factory.createThis(), descriptor ?? factory.createNull(), memberDecoratorsName, context, factory.createNull(), extraInitializers);
                const esDecorateStatement = factory.createExpressionStatement(esDecorateExpression);
                setSourceMapRange(esDecorateStatement, moveRangePastDecorators(member));
                statements.push(esDecorateStatement);
            }
            else if (isPropertyDeclaration(member)) {
                initializersName = memberInfo.memberInitializersName ??= createHelperVariable(member, "initializers");

                if (isStatic(member)) {
                    thisArg = classInfo.classThis;
                }

                let descriptor: Expression | undefined;
                if (isPrivateIdentifierClassElementDeclaration(member) && hasAccessorModifier(member) && createDescriptor) {
                    descriptor = createDescriptor(member, /*modifiers*/ undefined);
                    memberInfo.memberDescriptorName = descriptorName = createHelperVariable(member, "descriptor");
                    descriptor = factory.createAssignment(descriptorName, descriptor);
                }

                // _static_field_initializers = __esDecorate(null, null, _static_member_decorators, { kind: "field", name: "...", static: true, private: ..., access: { ... } }, _staticExtraInitializers);
                // _field_initializers = __esDecorate(null, null, _member_decorators, { kind: "field", name: "...", static: false, private: ..., access: { ... } }, _instanceExtraInitializers);
                const esDecorateExpression = emitHelpers().createESDecorateHelper(
                    isAutoAccessorPropertyDeclaration(member) ?
                        factory.createThis() :
                        factory.createNull(),
                    descriptor ?? factory.createNull(),
                    memberDecoratorsName,
                    context,
                    initializersName,
                    extraInitializers);
                const esDecorateStatement = factory.createExpressionStatement(esDecorateExpression);
                setSourceMapRange(esDecorateStatement, moveRangePastDecorators(member));
                statements.push(esDecorateStatement);
            }
        }

        if (name === undefined) {
            enterName();
            if (useNamedEvaluation) {
                ({ referencedName, name } = visitReferencedPropertyName(member.name));
            }
            else {
                name = visitPropertyName(member.name);
            }
            exitName();
        }

        if (!some(modifiers) && (isMethodDeclaration(member) || isPropertyDeclaration(member))) {
            // Don't emit leading comments on the name for methods and properties without modifiers, otherwise we
            // will end up printing duplicate comments.
            setEmitFlags(name, EmitFlags.NoLeadingComments);
        }

        return { modifiers, referencedName, name, initializersName, descriptorName, thisArg };
    }

    function visitMethodDeclaration(node: MethodDeclaration) {
        enterClassElement(node);
        const { modifiers, name, descriptorName } = partialTransformClassElement(node, /*useNamedEvaluation*/ false, classInfo, createMethodDescriptorObject);
        if (descriptorName) {
            exitClassElement();
            return finishClassElement(createMethodDescriptorForwarder(modifiers, name, descriptorName), node);
        }
        else {
            const parameters = visitNodes(node.parameters, visitor, isParameter);
            const body = visitNode(node.body, visitor, isBlock);
            exitClassElement();
            return finishClassElement(factory.updateMethodDeclaration(node, modifiers, node.asteriskToken, name, /*questionToken*/ undefined, /*typeParameters*/ undefined, parameters, /*type*/ undefined, body), node);
        }
    }

    function visitGetAccessorDeclaration(node: GetAccessorDeclaration) {
        enterClassElement(node);
        const { modifiers, name, descriptorName } = partialTransformClassElement(node, /*useNamedEvaluation*/ false, classInfo, createGetAccessorDescriptorObject);
        if (descriptorName) {
            exitClassElement();
            return finishClassElement(createGetAccessorDescriptorForwarder(modifiers, name, descriptorName), node);
        }
        else {
            const parameters = visitNodes(node.parameters, visitor, isParameter);
            const body = visitNode(node.body, visitor, isBlock);
            exitClassElement();
            return finishClassElement(factory.updateGetAccessorDeclaration(node, modifiers, name, parameters, /*type*/ undefined, body), node);
        }
    }

    function visitSetAccessorDeclaration(node: SetAccessorDeclaration) {
        enterClassElement(node);
        const { modifiers, name, descriptorName } = partialTransformClassElement(node, /*useNamedEvaluation*/ false, classInfo, createSetAccessorDescriptorObject);
        if (descriptorName) {
            exitClassElement();
            return finishClassElement(createSetAccessorDescriptorForwarder(modifiers, name, descriptorName), node);
        }
        else {
            const parameters = visitNodes(node.parameters, visitor, isParameter);
            const body = visitNode(node.body, visitor, isBlock);
            exitClassElement();
            return finishClassElement(factory.updateSetAccessorDeclaration(node, modifiers, name, parameters, body), node);
        }
    }

    function visitClassStaticBlockDeclaration(node: ClassStaticBlockDeclaration) {
        enterClassElement(node);

        if (classInfo) classInfo.hasStaticInitializers = true;
        const result = visitEachChild(node, visitor, context);

        exitClassElement();
        return result;
    }

    function visitPropertyDeclaration(node: PropertyDeclaration) {
        enterClassElement(node);

        // TODO(rbuckton): We support decorating `declare x` fields with legacyDecorators, but we currently don't
        //                 support them with esDecorators. We need to consider whether we will support them in the
        //                 future, and how. For now, these should be elided by the `ts` transform.
        Debug.assert(!isAmbientPropertyDeclaration(node), "Not yet implemented.");

        // 10.2.1.3 RS: EvaluateBody
        //   Initializer : `=` AssignmentExpression
        //     ...
        //     3. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true*, then
        //        a. Let _value_ be ? NamedEvaluation of |Initializer| with argument _functionObject_.[[ClassFieldInitializerName]].
        //     ...

        const useNamedEvaluation = isNamedEvaluation(node, isAnonymousClassNeedingAssignedName);
        const { modifiers, name, referencedName, initializersName, descriptorName, thisArg } = partialTransformClassElement(node, useNamedEvaluation, classInfo, hasAccessorModifier(node) ? createAccessorPropertyDescriptorObject : undefined);

        startLexicalEnvironment();

        let initializer = referencedName ?
            visitNode(node.initializer, node => namedEvaluationVisitor(node, referencedName), isExpression):
            visitNode(node.initializer, visitor, isExpression);

        if (initializersName) {
            initializer = emitHelpers().createRunInitializersHelper(
                thisArg ?? factory.createThis(),
                initializersName,
                initializer ?? factory.createVoidZero());
        }

        if (!isStatic(node) && classInfo?.instanceExtraInitializersName && !classInfo?.hasInjectedInstanceInitializers) {
            // for the first non-static field initializer, inject a call to `__runInitializers`.
            classInfo.hasInjectedInstanceInitializers = true;
            initializer ??= factory.createVoidZero();
            initializer = factory.createParenthesizedExpression(factory.createComma(
                emitHelpers().createRunInitializersHelper(
                    factory.createThis(),
                    classInfo.instanceExtraInitializersName
                ),
                initializer
            ));
        }

        if (isStatic(node) && classInfo && initializer) {
            classInfo.hasStaticInitializers = true;
        }

        const declarations = endLexicalEnvironment();
        if (some(declarations)) {
            initializer = factory.createImmediatelyInvokedArrowFunction([
                ...declarations,
                factory.createReturnStatement(initializer)
            ]);
        }

        exitClassElement();

        if (hasAccessorModifier(node) && descriptorName) {
            // given:
            //  accessor #x = 1;
            //
            // emits:
            //  static {
            //      _esDecorate(null, _private_x_descriptor = { get() { return this.#x_1; }, set(value) { this.#x_1 = value; } }, ...)
            //  }
            //  ...
            //  #x_1 = 1;
            //  get #x() { return _private_x_descriptor.get.call(this); }
            //  set #x(value) { _private_x_descriptor.set.call(this, value); }

            const commentRange = getCommentRange(node);
            const sourceMapRange = getSourceMapRange(node);

            // Since we're creating two declarations where there was previously one, cache
            // the expression for any computed property names.
            const name = node.name;
            let getterName = name;
            let setterName = name;
            if (isComputedPropertyName(name) && !isSimpleInlineableExpression(name.expression)) {
                const cacheAssignment = findComputedPropertyNameCacheAssignment(name);
                if (cacheAssignment) {
                    getterName = factory.updateComputedPropertyName(name, visitNode(name.expression, visitor, isExpression));
                    setterName = factory.updateComputedPropertyName(name, cacheAssignment.left);
                }
                else {
                    const temp = factory.createTempVariable(hoistVariableDeclaration);
                    setSourceMapRange(temp, name.expression);
                    const expression = visitNode(name.expression, visitor, isExpression);
                    const assignment = factory.createAssignment(temp, expression);
                    setSourceMapRange(assignment, name.expression);
                    getterName = factory.updateComputedPropertyName(name, assignment);
                    setterName = factory.updateComputedPropertyName(name, temp);
                }
            }

            const modifiersWithoutAccessor = visitNodes(modifiers, node => node.kind !== SyntaxKind.AccessorKeyword ? node : undefined, isModifier);

            const backingField = createAccessorPropertyBackingField(factory, node, modifiersWithoutAccessor, initializer);
            setOriginalNode(backingField, node);
            setEmitFlags(backingField, EmitFlags.NoComments);
            setSourceMapRange(backingField, sourceMapRange);
            setSourceMapRange(backingField.name, node.name);

            const getter = createGetAccessorDescriptorForwarder(modifiersWithoutAccessor, getterName, descriptorName);
            setOriginalNode(getter, node);
            setCommentRange(getter, commentRange);
            setSourceMapRange(getter, sourceMapRange);

            const setter = createSetAccessorDescriptorForwarder(modifiersWithoutAccessor, setterName, descriptorName);
            setOriginalNode(setter, node);
            setEmitFlags(setter, EmitFlags.NoComments);
            setSourceMapRange(setter, sourceMapRange);

            return [backingField, getter, setter];
        }

        return finishClassElement(factory.updatePropertyDeclaration(node, modifiers, name, /*questionOrExclamationToken*/ undefined, /*type*/ undefined, initializer), node);
    }

    function visitThisExpression(node: ThisExpression) {
        return classThis ?? node;
    }

    function visitCallExpression(node: CallExpression) {
        if (isSuperProperty(node.expression) && classThis) {
            const expression = visitNode(node.expression, visitor, isExpression);
            const argumentsList = visitNodes(node.arguments, visitor, isExpression);
            const invocation = factory.createFunctionCallCall(expression, classThis, argumentsList);
            setOriginalNode(invocation, node);
            setTextRange(invocation, node);
            return invocation;
        }

        return visitEachChild(node, visitor, context);
    }

    function visitTaggedTemplateExpression(node: TaggedTemplateExpression) {
        if (isSuperProperty(node.tag) && classThis) {
            const tag = visitNode(node.tag, visitor, isExpression);
            const boundTag = factory.createFunctionBindCall(tag, classThis, []);
            setOriginalNode(boundTag, node);
            setTextRange(boundTag, node);
            const template = visitNode(node.template, visitor, isTemplateLiteral);
            return factory.updateTaggedTemplateExpression(node, boundTag, /*typeArguments*/ undefined, template);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitPropertyAccessExpression(node: PropertyAccessExpression) {
        if (isSuperProperty(node) && isIdentifier(node.name) && classThis && classSuper) {
            const propertyName = factory.createStringLiteralFromNode(node.name);
            const superProperty = factory.createReflectGetCall(classSuper, propertyName, classThis);
            setOriginalNode(superProperty, node.expression);
            setTextRange(superProperty, node.expression);
            return superProperty;
        }

        return visitEachChild(node, visitor, context);
    }

    function visitElementAccessExpression(node: ElementAccessExpression) {
        if (isSuperProperty(node) && classThis && classSuper) {
            const propertyName = visitNode(node.argumentExpression, visitor, isExpression);
            const superProperty = factory.createReflectGetCall(classSuper, propertyName, classThis);
            setOriginalNode(superProperty, node.expression);
            setTextRange(superProperty, node.expression);
            return superProperty;
        }

        return visitEachChild(node, visitor, context);
    }

    function visitParameterDeclaration(node: ParameterDeclaration) {
        // 8.6.3 RS: IteratorBindingInitialization
        //   SingleNameBinding : BindingIdentifier Initializer?
        //     ...
        //     5. If |Initializer| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //           i. Set _v_ to ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...
        //
        // 14.3.3.3 RS: KeyedBindingInitialization
        //   SingleNameBinding : BindingIdentifier Initializer?
        //     ...
        //     4. If |Initializer| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //           i. Set _v_ to ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...

        let updated: ParameterDeclaration;
        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const assignedName = getAssignedNameOfIdentifier(node.name, node.initializer);
            const name = visitNode(node.name, visitor, isBindingName);
            const initializer = visitNode(node.initializer, node => namedEvaluationVisitor(node, assignedName), isExpression);
            updated = factory.updateParameterDeclaration(
                node,
                /*modifiers*/ undefined,
                /*dotDotDotToken*/ undefined,
                name,
                /*questionToken*/ undefined,
                /*type*/ undefined,
                initializer);
        }
        else {
            updated = factory.updateParameterDeclaration(
                node,
                /*modifiers*/ undefined,
                node.dotDotDotToken,
                visitNode(node.name, visitor, isBindingName),
                /*questionToken*/ undefined,
                /*type*/ undefined,
                visitNode(node.initializer, visitor, isExpression)
            );
        }

        if (updated !== node) {
            // While we emit the source map for the node after skipping decorators and modifiers,
            // we need to emit the comments for the original range.
            setCommentRange(updated, node);
            setTextRange(updated, moveRangePastModifiers(node));
            setSourceMapRange(updated, moveRangePastModifiers(node));
            setEmitFlags(updated.name, EmitFlags.NoTrailingSourceMap);
        }
        return updated;
    }

    function isAnonymousClassNeedingAssignedName(node: AnonymousFunctionDefinition) {
        return isClassExpression(node) && !node.name && isDecoratedClassLike(node);
    }

    function visitForStatement(node: ForStatement) {
        return factory.updateForStatement(
            node,
            visitNode(node.initializer, discardedValueVisitor, isForInitializer),
            visitNode(node.condition, visitor, isExpression),
            visitNode(node.incrementor, discardedValueVisitor, isExpression),
            visitIterationBody(node.statement, visitor, context)
        );
    }

    function visitExpressionStatement(node: ExpressionStatement) {
        return visitEachChild(node, discardedValueVisitor, context);
    }

    function visitBinaryExpression(node: BinaryExpression, discarded: boolean) {
        if (isDestructuringAssignment(node)) {
            const left = visitAssignmentPattern(node.left);
            const right = visitNode(node.right, visitor, isExpression);
            return factory.updateBinaryExpression(node, left, node.operatorToken, right);
        }

        if (isAssignmentExpression(node)) {
            // 13.15.2 RS: Evaluation
            //   AssignmentExpression : LeftHandSideExpression `=` AssignmentExpression
            //     1. If |LeftHandSideExpression| is neither an |ObjectLiteral| nor an |ArrayLiteral|, then
            //        a. Let _lref_ be ? Evaluation of |LeftHandSideExpression|.
            //        b. If IsAnonymousFunctionDefinition(|AssignmentExpression|) and IsIdentifierRef of |LeftHandSideExpression| are both *true*, then
            //           i. Let _rval_ be ? NamedEvaluation of |AssignmentExpression| with argument _lref_.[[ReferencedName]].
            //     ...
            //
            //   AssignmentExpression : LeftHandSideExpression `&&=` AssignmentExpression
            //     ...
            //     5. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true* and IsIdentifierRef of |LeftHandSideExpression| is *true*, then
            //        a. Let _rval_ be ? NamedEvaluation of |AssignmentExpression| with argument _lref_.[[ReferencedName]].
            //     ...
            //
            //   AssignmentExpression : LeftHandSideExpression `||=` AssignmentExpression
            //     ...
            //     5. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true* and IsIdentifierRef of |LeftHandSideExpression| is *true*, then
            //        a. Let _rval_ be ? NamedEvaluation of |AssignmentExpression| with argument _lref_.[[ReferencedName]].
            //     ...
            //
            //   AssignmentExpression : LeftHandSideExpression `??=` AssignmentExpression
            //     ...
            //     4. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true* and IsIdentifierRef of |LeftHandSideExpression| is *true*, then
            //        a. Let _rval_ be ? NamedEvaluation of |AssignmentExpression| with argument _lref_.[[ReferencedName]].
            //     ...

            if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
                const assignedName = getAssignedNameOfIdentifier(node.left, node.right);
                const left = visitNode(node.left, visitor, isExpression);
                const right = visitNode(node.right, node => namedEvaluationVisitor(node, assignedName), isExpression);
                return factory.updateBinaryExpression(node, left, node.operatorToken, right);
            }

            if (isSuperProperty(node.left) && classThis && classSuper) {
                let setterName =
                    isElementAccessExpression(node.left) ? visitNode(node.left.argumentExpression, visitor, isExpression) :
                    isIdentifier(node.left.name) ? factory.createStringLiteralFromNode(node.left.name) :
                    undefined;
                if (setterName) {
                    // super.x = ...
                    // super.x += ...
                    // super[x] = ...
                    // super[x] += ...
                    let expression = visitNode(node.right, visitor, isExpression);
                    if (isCompoundAssignment(node.operatorToken.kind)) {
                        let getterName = setterName;
                        if (!isSimpleInlineableExpression(setterName)) {
                            getterName = factory.createTempVariable(hoistVariableDeclaration);
                            setterName = factory.createAssignment(getterName, setterName);
                        }

                        const superPropertyGet = factory.createReflectGetCall(
                            classSuper,
                            getterName,
                            classThis);
                        setOriginalNode(superPropertyGet, node.left);
                        setTextRange(superPropertyGet, node.left);

                        expression = factory.createBinaryExpression(
                            superPropertyGet,
                            getNonAssignmentOperatorForCompoundAssignment(node.operatorToken.kind),
                            expression
                        );
                        setTextRange(expression, node);
                    }

                    const temp = discarded ? undefined : factory.createTempVariable(hoistVariableDeclaration);
                    if (temp) {
                        expression = factory.createAssignment(temp, expression);
                        setTextRange(temp, node);
                    }

                    expression = factory.createReflectSetCall(
                        classSuper,
                        setterName,
                        expression,
                        classThis
                    );
                    setOriginalNode(expression, node);
                    setTextRange(expression, node);

                    if (temp) {
                        expression = factory.createComma(expression, temp);
                        setTextRange(expression, node);
                    }

                    return expression;
                }
            }
        }

        if (node.operatorToken.kind === SyntaxKind.CommaToken) {
            const left = visitNode(node.left, discardedValueVisitor, isExpression);
            const right = visitNode(node.right, discarded ? discardedValueVisitor : visitor, isExpression);
            return factory.updateBinaryExpression(node, left, node.operatorToken, right);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitPreOrPostfixUnaryExpression(node: PrefixUnaryExpression | PostfixUnaryExpression, discarded: boolean) {
        if (node.operator === SyntaxKind.PlusPlusToken ||
            node.operator === SyntaxKind.MinusMinusToken) {
            const operand = skipParentheses(node.operand);
            if (isSuperProperty(operand) && classThis && classSuper) {
                let setterName =
                    isElementAccessExpression(operand) ? visitNode(operand.argumentExpression, visitor, isExpression) :
                    isIdentifier(operand.name) ? factory.createStringLiteralFromNode(operand.name) :
                    undefined;
                if (setterName) {
                    let getterName = setterName;
                    if (!isSimpleInlineableExpression(setterName)) {
                        getterName = factory.createTempVariable(hoistVariableDeclaration);
                        setterName = factory.createAssignment(getterName, setterName);
                    }

                    let expression: Expression = factory.createReflectGetCall(classSuper, getterName, classThis);
                    setOriginalNode(expression, node);
                    setTextRange(expression, node);

                    // If the result of this expression is discarded (i.e., it's in a position where the result
                    // will be otherwise unused, such as in an expression statement or the left side of a comma), we
                    // don't need to create an extra temp variable to hold the result:
                    //
                    //  source (discarded):
                    //    super.x++;
                    //  generated:
                    //    _a = Reflect.get(_super, "x"), _a++, Reflect.set(_super, "x", _a);
                    //
                    // Above, the temp variable `_a` is used to perform the correct coercion (i.e., number or
                    // bigint). Since the result of the postfix unary is discarded, we don't need to capture the
                    // result of the expression.
                    //
                    //  source (not discarded):
                    //    y = super.x++;
                    //  generated:
                    //    y = (_a = Reflect.get(_super, "x"), _b = _a++, Reflect.set(_super, "x", _a), _b);
                    //
                    // When the result isn't discarded, we introduce a new temp variable (`_b`) to capture the
                    // result of the operation so that we can provide it to `y` when the assignment is complete.

                    const temp = discarded ? undefined : factory.createTempVariable(hoistVariableDeclaration);
                    expression = expandPreOrPostfixIncrementOrDecrementExpression(factory, node, expression, hoistVariableDeclaration, temp);
                    expression = factory.createReflectSetCall(classSuper, setterName, expression, classThis);
                    setOriginalNode(expression, node);
                    setTextRange(expression, node);

                    if (temp) {
                        expression = factory.createComma(expression, temp);
                        setTextRange(expression, node);
                    }

                    return expression;
                }
            }
        }

        return visitEachChild(node, visitor, context);
    }

    function visitCommaListExpression(node: CommaListExpression, discarded: boolean) {
        const elements = discarded ?
            visitCommaListElements(node.elements, discardedValueVisitor) :
            visitCommaListElements(node.elements, visitor, discardedValueVisitor);
        return factory.updateCommaListExpression(node, elements);
    }

    function visitReferencedPropertyName(node: PropertyName) {
        if (isPropertyNameLiteral(node) || isPrivateIdentifier(node)) {
            const referencedName = factory.createStringLiteralFromNode(node);
            const name = visitNode(node, visitor, isPropertyName);
            return { referencedName, name };
        }

        if (isPropertyNameLiteral(node.expression) && !isIdentifier(node.expression)) {
            const referencedName = factory.createStringLiteralFromNode(node.expression);
            const name = visitNode(node, visitor, isPropertyName);
            return { referencedName, name };
        }

        const referencedName = factory.getGeneratedNameForNode(node);
        hoistVariableDeclaration(referencedName);

        const key = emitHelpers().createPropKeyHelper(visitNode(node.expression, visitor, isExpression));
        const assignment = factory.createAssignment(referencedName, key);
        const name = factory.updateComputedPropertyName(node, injectPendingExpressions(assignment));
        return { referencedName, name };
    }

    function visitPropertyName(node: PropertyName) {
        if (isComputedPropertyName(node)) {
            return visitComputedPropertyName(node);
        }
        return visitNode(node, visitor, isPropertyName);
    }

    function visitComputedPropertyName(node: ComputedPropertyName) {
        let expression = visitNode(node.expression, visitor, isExpression);
        if (!isSimpleInlineableExpression(expression)) {
            expression = injectPendingExpressions(expression);
        }
        return factory.updateComputedPropertyName(node, expression);
    }

    function visitPropertyAssignment(node: PropertyAssignment) {
        // 13.2.5.5 RS: PropertyDefinitionEvaluation
        //   PropertyAssignment : PropertyName `:` AssignmentExpression
        //     ...
        //     5. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true* and _isProtoSetter_ is *false*, then
        //        a. Let _popValue_ be ? NamedEvaluation of |AssignmentExpression| with argument _propKey_.
        //     ...

        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const { referencedName, name } = visitReferencedPropertyName(node.name);
            const initializer = visitNode(node.initializer, node => namedEvaluationVisitor(node, referencedName), isExpression);
            return factory.updatePropertyAssignment(node, name, initializer);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitVariableDeclaration(node: VariableDeclaration) {
        // 14.3.1.2 RS: Evaluation
        //   LexicalBinding : BindingIdentifier Initializer
        //     ...
        //     3. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //        a. Let _value_ be ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...
        //
        // 14.3.2.1 RS: Evaluation
        //   VariableDeclaration : BindingIdentifier Initializer
        //     ...
        //     3. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //        a. Let _value_ be ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...

        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const assignedName = getAssignedNameOfIdentifier(node.name, node.initializer);
            const name = visitNode(node.name, visitor, isBindingName);
            const initializer = visitNode(node.initializer, node => namedEvaluationVisitor(node, assignedName), isExpression);
            return factory.updateVariableDeclaration(node, name, /*exclamationToken*/ undefined, /*type*/ undefined, initializer);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitBindingElement(node: BindingElement) {
        // 8.6.3 RS: IteratorBindingInitialization
        //   SingleNameBinding : BindingIdentifier Initializer?
        //     ...
        //     5. If |Initializer| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //           i. Set _v_ to ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...
        //
        // 14.3.3.3 RS: KeyedBindingInitialization
        //   SingleNameBinding : BindingIdentifier Initializer?
        //     ...
        //     4. If |Initializer| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //           i. Set _v_ to ? NamedEvaluation of |Initializer| with argument _bindingId_.
        //     ...

        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const assignedName = getAssignedNameOfIdentifier(node.name, node.initializer);
            const propertyName = visitNode(node.propertyName, visitor, isPropertyName);
            const name = visitNode(node.name, visitor, isBindingName);
            const initializer = visitNode(node.initializer, node => namedEvaluationVisitor(node, assignedName), isExpression);
            return factory.updateBindingElement(node, /*dotDotDotToken*/ undefined, propertyName, name, initializer);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitDestructuringAssignmentTarget(node: LeftHandSideExpression): Expression {
        if (isObjectLiteralExpression(node) || isArrayLiteralExpression(node)) {
            return visitAssignmentPattern(node);
        }

        if (isSuperProperty(node) && classThis && classSuper) {
            const propertyName =
                isElementAccessExpression(node) ? visitNode(node.argumentExpression, visitor, isExpression) :
                isIdentifier(node.name) ? factory.createStringLiteralFromNode(node.name) :
                undefined;
            if (propertyName) {
                const paramName = factory.createTempVariable(/*recordTempVariable*/ undefined);
                const expression = factory.createAssignmentTargetWrapper(
                    paramName,
                    factory.createReflectSetCall(
                        classSuper,
                        propertyName,
                        paramName,
                        classThis,
                    )
                );
                setOriginalNode(expression, node);
                setTextRange(expression, node);
                return expression;
            }
        }

        return visitEachChild(node, visitor, context);
    }

    function visitAssignmentElement(node: Exclude<ArrayAssignmentElement, SpreadElement | OmittedExpression>): ArrayAssignmentElement {
        // 13.15.5.5 RS: IteratorDestructuringAssignmentEvaluation
        //   AssignmentElement : DestructuringAssignmentTarget Initializer?
        //     ...
        //     4. If |Initializer| is present and _value_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) and IsIdentifierRef of |DestructuringAssignmentTarget| are both *true*, then
        //           i. Let _v_ be ? NamedEvaluation of |Initializer| with argument _lref_.[[ReferencedName]].
        //     ...

        if (isAssignmentExpression(node, /*excludeCompoundAssignment*/ true)) {
            const assignmentTarget = visitDestructuringAssignmentTarget(node.left);
            let initializer: Expression;
            if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
                const assignedName = getAssignedNameOfIdentifier(node.left, node.right);
                initializer = visitNode(node.right, node => namedEvaluationVisitor(node, assignedName), isExpression);
            }
            else {
                initializer = visitNode(node.right, visitor, isExpression);
            }
            return factory.updateBinaryExpression(node, assignmentTarget, node.operatorToken, initializer) as ArrayAssignmentElement;
        }
        else {
            return visitDestructuringAssignmentTarget(node) as ArrayAssignmentElement;
        }
    }

    function visitAssignmentRestElement(node: SpreadElement) {
        if (isLeftHandSideExpression(node.expression)) {
            const expression = visitDestructuringAssignmentTarget(node.expression);
            return factory.updateSpreadElement(node, expression);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitArrayAssignmentElement(node: Expression): Expression {
        Debug.assertNode(node, isArrayBindingOrAssignmentElement);
        if (isSpreadElement(node)) return visitAssignmentRestElement(node);
        if (!isOmittedExpression(node)) return visitAssignmentElement(node);
        return visitEachChild(node, visitor, context);
    }

    function visitAssignmentProperty(node: PropertyAssignment) {
        // AssignmentProperty : PropertyName `:` AssignmentElement
        // AssignmentElement : DestructuringAssignmentTarget Initializer?

        // 13.15.5.6 RS: KeyedDestructuringAssignmentEvaluation
        //   AssignmentElement : DestructuringAssignmentTarget Initializer?
        //     ...
        //     3. If |Initializer| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousfunctionDefinition(|Initializer|) and IsIdentifierRef of |DestructuringAssignmentTarget| are both *true*, then
        //           i. Let _rhsValue_ be ? NamedEvaluation of |Initializer| with argument _lref_.[[ReferencedName]].
        //     ...

        const name = visitNode(node.name, visitor, isPropertyName);
        if (isAssignmentExpression(node.initializer, /*excludeCompoundAssignment*/ true)) {
            const assignmentElement = visitAssignmentElement(node.initializer);
            return factory.updatePropertyAssignment(node, name, assignmentElement);
        }

        if (isLeftHandSideExpression(node.initializer)) {
            const assignmentElement = visitDestructuringAssignmentTarget(node.initializer);
            return factory.updatePropertyAssignment(node, name, assignmentElement);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitShorthandAssignmentProperty(node: ShorthandPropertyAssignment) {
        // AssignmentProperty : IdentifierReference Initializer?

        // 13.15.5.3 RS: PropertyDestructuringAssignmentEvaluation
        //   AssignmentProperty : IdentifierReference Initializer?
        //     ...
        //     4. If |Initializer?| is present and _v_ is *undefined*, then
        //        a. If IsAnonymousFunctionDefinition(|Initializer|) is *true*, then
        //           i. Set _v_ to ? NamedEvaluation of |Initializer| with argument _P_.
        //     ...

        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const assignedName = getAssignedNameOfIdentifier(node.name, node.objectAssignmentInitializer);
            const name = visitNode(node.name, visitor, isIdentifier);
            const objectAssignmentInitializer = visitNode(node.objectAssignmentInitializer, node => namedEvaluationVisitor(node, assignedName), isExpression);
            return factory.updateShorthandPropertyAssignment(node, name, objectAssignmentInitializer);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitAssignmentRestProperty(node: SpreadAssignment) {
        if (isLeftHandSideExpression(node.expression)) {
            const expression = visitDestructuringAssignmentTarget(node.expression);
            return factory.updateSpreadAssignment(node, expression);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitObjectAssignmentElement(node: ObjectLiteralElement) {
        Debug.assertNode(node, isObjectBindingOrAssignmentElement);
        if (isSpreadAssignment(node)) return visitAssignmentRestProperty(node);
        if (isShorthandPropertyAssignment(node)) return visitShorthandAssignmentProperty(node);
        if (isPropertyAssignment(node)) return visitAssignmentProperty(node);
        return visitEachChild(node, visitor, context);
    }

    function visitAssignmentPattern(node: AssignmentPattern) {
        if (isArrayLiteralExpression(node)) {
            const elements = visitNodes(node.elements, visitArrayAssignmentElement, isExpression);
            return factory.updateArrayLiteralExpression(node, elements);
        }
        else {
            const properties = visitNodes(node.properties, visitObjectAssignmentElement, isObjectLiteralElementLike);
            return factory.updateObjectLiteralExpression(node, properties);
        }
    }

    function visitExportAssignment(node: ExportAssignment) {
        // 16.2.3.7 RS: Evaluation
        //   ExportDeclaration : `export` `default` AssignmentExpression `;`
        //     1. If IsAnonymousFunctionDefinition(|AssignmentExpression|) is *true*, then
        //        a. Let _value_ be ? NamedEvaluation of |AssignmentExpression| with argument `"default"`.
        //     ...

        // NOTE: Since emit for `export =` translates to `module.exports = ...`, the assigned nameof the class
        // is `""`.

        if (isNamedEvaluation(node, isAnonymousClassNeedingAssignedName)) {
            const referencedName = factory.createStringLiteral(node.isExportEquals ? "" : "default");
            const modifiers = visitNodes(node.modifiers, modifierVisitor, isModifier);
            const expression = visitNode(node.expression, node => namedEvaluationVisitor(node, referencedName), isExpression);
            return factory.updateExportAssignment(node, modifiers, expression);
        }

        return visitEachChild(node, visitor, context);
    }

    function visitParenthesizedExpression(node: ParenthesizedExpression, discarded: boolean, referencedName: Expression | undefined) {
        // 8.4.5 RS: NamedEvaluation
        //   ParenthesizedExpression : `(` Expression `)`
        //     ...
        //     2. Return ? NamedEvaluation of |Expression| with argument _name_.

        const visitorFunc: Visitor<Node, Node> =
            discarded ? discardedValueVisitor :
            referencedName ? node => namedEvaluationVisitor(node, referencedName) :
            visitor;
        const expression = visitNode(node.expression, visitorFunc, isExpression);
        return factory.updateParenthesizedExpression(node, expression);
    }

    function visitPartiallyEmittedExpression(node: PartiallyEmittedExpression, discarded: boolean, referencedName: Expression | undefined) {
        // Emulates 8.4.5 RS: NamedEvaluation

        const visitorFunc: Visitor<Node, Node> =
            discarded ? discardedValueVisitor :
            referencedName ? node => namedEvaluationVisitor(node, referencedName) :
            visitor;
        const expression = visitNode(node.expression, visitorFunc, isExpression);
        return factory.updatePartiallyEmittedExpression(node, expression);
    }

    function injectPendingExpressions(expression: Expression) {
        if (some(pendingExpressions)) {
            if (isParenthesizedExpression(expression)) {
                pendingExpressions.push(expression.expression);
                expression = factory.updateParenthesizedExpression(expression, factory.inlineExpressions(pendingExpressions));
            }
            else {
                pendingExpressions.push(expression);
                expression = factory.inlineExpressions(pendingExpressions);
            }
            pendingExpressions = undefined;
        }
        return expression;
    }

    /**
     * Transforms all of the decorators for a declaration into an array of expressions.
     *
     * @param allDecorators An object containing all of the decorators for the declaration.
     */
    function transformAllDecoratorsOfDeclaration(allDecorators: AllDecorators | undefined) {
        if (!allDecorators) {
            return undefined;
        }

        const decoratorExpressions: Expression[] = [];
        addRange(decoratorExpressions, map(allDecorators.decorators, transformDecorator));
        return decoratorExpressions;
    }

    /**
     * Transforms a decorator into an expression.
     *
     * @param decorator The decorator node.
     */
    function transformDecorator(decorator: Decorator) {
        const expression = visitNode(decorator.expression, visitor, isExpression);
        setEmitFlags(expression, EmitFlags.NoComments);
        return expression;
    }

    /**
     * Creates a `value`, `get`, or `set` method for a pseudo-{@link PropertyDescriptor} object created for a private element.
     */
    function createDescriptorMethod(original: Node, name: PrivateIdentifier, modifiers: ModifiersArray | undefined, asteriskToken: AsteriskToken | undefined, kind: "value" | "get" | "set", parameters: readonly ParameterDeclaration[], body: Block | undefined) {
        const func = factory.createFunctionExpression(
            modifiers,
            asteriskToken,
            /*name*/ undefined,
            /*typeParameters*/ undefined,
            parameters,
            /*type*/ undefined,
            body ?? factory.createBlock([])
        );
        setOriginalNode(func, original);
        setSourceMapRange(func, moveRangePastDecorators(original));
        setEmitFlags(func, EmitFlags.NoComments);

        const prefix = kind === "get" || kind === "set" ? kind : undefined;
        const functionName = factory.createStringLiteralFromNode(name, /*isSingleQuote*/ undefined);
        const namedFunction = emitHelpers().createSetFunctionNameHelper(func, functionName, prefix);

        const method = factory.createPropertyAssignment(factory.createIdentifier(kind), namedFunction);
        setOriginalNode(method, original);
        setSourceMapRange(method, moveRangePastDecorators(original));
        setEmitFlags(method, EmitFlags.NoComments);
        return method;
    }

    /**
     * Creates a pseudo-{@link PropertyDescriptor} object used when decorating a private {@link MethodDeclaration}.
     */
    function createMethodDescriptorObject(node: PrivateIdentifierMethodDeclaration, modifiers: ModifiersArray | undefined) {
        return factory.createObjectLiteralExpression([
            createDescriptorMethod(
                node,
                node.name,
                modifiers,
                node.asteriskToken,
                "value",
                visitNodes(node.parameters, visitor, isParameter),
                visitNode(node.body, visitor, isBlock))
        ]);
    }

    /**
     * Creates a pseudo-{@link PropertyDescriptor} object used when decorating a private {@link GetAccessorDeclaration}.
     */
    function createGetAccessorDescriptorObject(node: PrivateIdentifierGetAccessorDeclaration, modifiers: ModifiersArray | undefined) {
        return factory.createObjectLiteralExpression([
            createDescriptorMethod(
                node,
                node.name,
                modifiers,
                /*asteriskToken*/ undefined,
                "get",
                [],
                visitNode(node.body, visitor, isBlock))
        ]);
    }

    /**
     * Creates a pseudo-{@link PropertyDescriptor} object used when decorating a private {@link SetAccessorDeclaration}.
     */
    function createSetAccessorDescriptorObject(node: PrivateIdentifierSetAccessorDeclaration, modifiers: ModifiersArray | undefined) {
        return factory.createObjectLiteralExpression([
            createDescriptorMethod(
                node,
                node.name,
                modifiers,
                /*asteriskToken*/ undefined,
                "set",
                visitNodes(node.parameters, visitor, isParameter),
                visitNode(node.body, visitor, isBlock))
        ]);
    }

    /**
     * Creates a pseudo-{@link PropertyDescriptor} object used when decorating an `accessor` {@link PropertyDeclaration} with a private name.
     */
    function createAccessorPropertyDescriptorObject(node: PrivateIdentifierPropertyDeclaration, modifiers: ModifiersArray | undefined) {
        //  {
        //      get() { return this.${privateName}; },
        //      set(value) { this.${privateName} = value; },
        //  }

        return factory.createObjectLiteralExpression([
            createDescriptorMethod(
                node,
                node.name,
                modifiers,
                /*asteriskToken*/ undefined,
                "get",
                [],
                factory.createBlock([
                    factory.createReturnStatement(
                        factory.createPropertyAccessExpression(
                            factory.createThis(),
                            factory.getGeneratedPrivateNameForNode(node.name)
                        )
                    )
                ])
            ),
            createDescriptorMethod(
                node,
                node.name,
                modifiers,
                /*asteriskToken*/ undefined,
                "set",
                [factory.createParameterDeclaration(
                    /*modifiers*/ undefined,
                    /*dotDotDotToken*/ undefined,
                    "value"
                )],
                factory.createBlock([
                    factory.createExpressionStatement(
                        factory.createAssignment(
                            factory.createPropertyAccessExpression(
                                factory.createThis(),
                                factory.getGeneratedPrivateNameForNode(node.name)
                            ),
                            factory.createIdentifier("value")
                        )
                    )
                ])
            )
        ]);
    }

    /**
     * Creates a {@link MethodDeclaration} that forwards its invocation to a {@link PropertyDescriptor} object.
     * @param modifiers The modifiers for the resulting declaration.
     * @param name The name for the resulting declaration.
     * @param descriptorName The name of the descriptor variable.
     */
    function createMethodDescriptorForwarder(modifiers: ModifiersArray | undefined, name: PropertyName, descriptorName: Identifier) {
        // strip off all but the `static` modifier
        modifiers = visitNodes(modifiers, node => isStaticModifier(node) ? node : undefined, isModifier);
        return factory.createGetAccessorDeclaration(
            modifiers,
            name,
            [],
            /*type*/ undefined,
            factory.createBlock([
                factory.createReturnStatement(
                    factory.createPropertyAccessExpression(
                        descriptorName,
                        factory.createIdentifier("value")
                    )
                )
            ])
        );
    }

    /**
     * Creates a {@link GetAccessorDeclaration} that forwards its invocation to a {@link PropertyDescriptor} object.
     * @param modifiers The modifiers for the resulting declaration.
     * @param name The name for the resulting declaration.
     * @param descriptorName The name of the descriptor variable.
     */
    function createGetAccessorDescriptorForwarder(modifiers: ModifiersArray | undefined, name: PropertyName, descriptorName: Identifier) {
        // strip off all but the `static` modifier
        modifiers = visitNodes(modifiers, node => isStaticModifier(node) ? node : undefined, isModifier);
        return factory.createGetAccessorDeclaration(
            modifiers,
            name,
            [],
            /*type*/ undefined,
            factory.createBlock([
                factory.createReturnStatement(
                    factory.createFunctionCallCall(
                        factory.createPropertyAccessExpression(
                            descriptorName,
                            factory.createIdentifier("get")
                        ),
                        factory.createThis(),
                        []
                    )
                )
            ])
        );
    }

    /**
     * Creates a {@link SetAccessorDeclaration} that forwards its invocation to a {@link PropertyDescriptor} object.
     * @param modifiers The modifiers for the resulting declaration.
     * @param name The name for the resulting declaration.
     * @param descriptorName The name of the descriptor variable.
     */
    function createSetAccessorDescriptorForwarder(modifiers: ModifiersArray | undefined, name: PropertyName, descriptorName: Identifier) {
        // strip off all but the `static` modifier
        modifiers = visitNodes(modifiers, node => isStaticModifier(node) ? node : undefined, isModifier);
        return factory.createSetAccessorDeclaration(
            modifiers,
            name,
            [factory.createParameterDeclaration(
                /*modifiers*/ undefined,
                /*dotDotDotToken*/ undefined,
                "value"
            )],
            factory.createBlock([
                factory.createReturnStatement(
                    factory.createFunctionCallCall(
                        factory.createPropertyAccessExpression(
                            descriptorName,
                            factory.createIdentifier("set")
                        ),
                        factory.createThis(),
                        [factory.createIdentifier("value")]
                    )
                )
            ])
        );
    }

    function getAssignedNameOfIdentifier(name: Identifier, initializer: Expression) {
        const originalClass = getOriginalNode(initializer, isClassLike);
        return originalClass && !originalClass.name && hasSyntacticModifier(originalClass, ModifierFlags.Default) ?
            factory.createStringLiteral("default") :
            factory.createStringLiteralFromNode(name);
    }
}
