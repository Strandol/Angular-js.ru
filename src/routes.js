app.config(($stateProvider) => {
    $stateProvider
        .state('index', {
            url: '',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
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
        .state('messages', {
            url: ':email/messages',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('messages.input', {
            url: '/input',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('messages.output', {
            url: '/output',
            template: `
                <message ng-repeat="msg in userController.selectedUser.outputMsgs"></message>
            `
        })
        .state('messages.marked', {
            url: '/marked',
            template: `
                <message ng-repeat="msg in userController.selectedUser.markedMsgs"></message>
            `
        })
})
