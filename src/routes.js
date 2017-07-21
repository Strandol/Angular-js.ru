app.config(($stateProvider) => {
    $stateProvider
        .state('index', {
            url: '',
            template: '<h2>Hello {{userController.selectedUser.user}}</h2>'
        })
        .state('contacts', {
            url: ':email/contacts',
            template: `
                <div class="contacts">
                    <contacts ng-repeat="contact in userController.selectedUser.contacts"></contacts>
                    <h2 class="noContactsHeader" ng-show="!userController.selectedUser.contacts.length">Контактов не записано...</h2>
                </div>
            `
        })
        .state('welcome', {
            url: ':email/welcome',
            template: '<h2>Hello {{userController.selectedUser.user}}</h2>'
        })
        .state('inputMsgs', {
            url: ':email/messages/input',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('outputMsgs', {
            url: ':email/messages/output',
            template: `
                <message ng-repeat="msg in userController.selectedUser.outputMsgs"></message>
            `
        })
        .state('markedMsgs', {
            url: ':email/messages/marked',
            template: `
                <message ng-repeat="msg in userController.selectedUser.markedMsgs"></message>
            `
        })
})