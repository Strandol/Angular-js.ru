let app = angular.module('userMail', []);

app.controller('UserController', function(MsgService, ContactService) {
    this.selectedSection = 'input';
    this.isContactsOpen = false;
    
    MsgService.loadUsers()
    .then(
        (users) => {
            this.users = users;
            this.users.forEach((user) => {
                user.inputMsgs = user.messages.filter((msg) => msg.section === 'input');
                user.outputMsgs = user.messages.filter((msg) => msg.section === 'output')
                user.markedMsgs = user.messages.filter((msg) => msg.section === 'marked')
                user.selectedMsgs = user.inputMsgs;
            })
            
            this.selectedUser = this.users[0];
            window.user = this.selectedUser
            this.selectedMsgs = this.users[0].inputMsgs;
        },
        (err) => { alert(err) }
    )
    .then(
        () => {
            ContactService.loadContacts()
            .then(
                (contacts) => {            
                    if (localStorage.getItem('contacts')) {
                        this.contacts = JSON.parse(localStorage.getItem('contacts'));
                        this.selectedUser.contacts = this.contacts.find((contacts) => {
                            return contacts.user === this.selectedUser.user;
                        }).contacts
                    } else {
                        this.contacts = contacts;
                        this.selectedUser.contacts = contacts.find((contacts) => {
                            return contacts.user === this.selectedUser.user;
                        }).contacts
                        localStorage.setItem('contacts', JSON.stringify(contacts));
                    }
                },
                (err) => { alert(err) }
            )
        }
    )
    

    
    this.onSectionClickHandler = (section) => {        
        this.isContactsOpen = false;
        this.selectedMsgs = this.selectedUser[`${section}Msgs`];
        this.selectedSection = section;
    }
    
    this.deleteContactByEmail = (email) => {
        let userIndex = this.contacts.findIndex((userContacts) => {
            return userContacts.user === this.selectedUser.user;
        })
        
        let index = this.contacts[userIndex].contacts.findIndex((contact) => {
            return contact.mail === email;
        })
        
        this.contacts[userIndex].contacts.splice(index, 1);
        this.selectedUser.contacts = this.contacts[userIndex].contacts;
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
    
    this.refreshData = () => {
        this.selectedMsgs = this.selectedUser[this.selectedSection + 'Msgs'];
        this.selectedUser.contacts = this.contacts.find((contacts) => {
            return contacts.user === this.selectedUser.user;
        }).contacts
    }
})

app.service('MsgService', function($q) {
    this.loadUsers = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/lfg6n', (response) => {
                resolve(response)
            }).fail((err) => { reject(err); })  
        })
    }
})

app.service('ContactService', function($q) {
    this.loadContacts = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/1djcfb', (response) => {
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