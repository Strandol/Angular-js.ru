let app = angular.module('userMail', []);

app.controller('UserController', function(MsgService, ContactService) {
    MsgService.loadMessages()
    .then(
        (messages) => {
            this.inputMsgs = messages.filter((msg) => msg.section === 'input');
            this.outputMsgs = messages.filter((msg) => msg.section === 'output')
            this.markedMsgs = messages.filter((msg) => msg.section === 'marked')
            this.selectedMsgs = this.inputMsgs;
        },
        (err) => { alert(err) }
    )
    
    ContactService.loadContacts()
    .then(
        (contacts) => { 
            if (localStorage.getItem('contacts')) {
                this.contacts = JSON.parse(localStorage.getItem('contacts'));
            } else {
                this.contacts = contacts;
                localStorage.setItem('contacts', JSON.stringify(contacts));
            }
        },
        (err) => { alert(err) }
    )
    
    this.onSectionClickHandler = (section) => {        
        this.isContactsOpen = false;
        this.selectedMsgs = this[`${section}Msgs`];
    }
    
    this.deleteContactByEmail = (email) => {
        let index = this.contacts.findIndex((contact) => {
            return contact.mail === email;
        })
        this.contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
    
    this.isContactsOpen = false;
})

app.service('MsgService', function($q) {
    this.loadMessages = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/try33', (response) => {
                resolve(response)
            }).fail((err) => { reject(err); })  
        })
    }
})

app.service('ContactService', function($q) {
    this.loadContacts = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/13d8n3', (response) => {
                resolve(response);
            }).fail((err) => { reject(err); })
        })
    }
})

app.directive('message', () => {
    return {
        restrict: 'E',
        template: `
            <li>
                <h2>{{msg.addresser}}</h2>
                <h3>{{msg.title}}</h3>
                <p class="date">{{msg.date}}</p>
                <button class="{{!opened ? 'isClosed' : ''}}" ng-model="opened" ng-click="opened=!opened"></button>
                <div ng-show="opened">
                    <h4>{{msg.addresser}}</h4>
                    <img src={{msg.addresserImg}}>
                    <p>{{msg.message}}</p>
                </div>
            </li>`
    }
})

app.directive('contacts', () => {
    return {
        restrict: 'E',
        template: `
            <div class="contact">
                <h3>{{contact.name}}</h3>
                <img src={{contact.avatar}}>
                <p>{{contact.age}} лет</p>
                <a href="mailto:{{contact.mail}}">{{contact.mail}}</a><br />
                <button class="contact__deleteContact" ng-click="userController.deleteContactByEmail(contact.mail)">
            </div>`
    }
})