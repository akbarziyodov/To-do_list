var Todo = function () {
	return  {
		addBtn: document.querySelector('.add-items'),
		addForm: document.querySelector('.addNew'),
		newList: document.querySelector('#todo-list-item'),
		list: document.querySelector('#list-items'),
		map: localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : '',
		msgBar: document.querySelector('.main-todo-input'),
		trashicon: '<img src="files/delete.svg"/>',
		noList: "You do not have any task. Let's create them!",
		existMsg: "You have already created todo with this name.",
		emptyMsg: "You cannot add empty todo.",
		checkList: function () {
			var self = this;
			if(self.map.length){
				self.map.filter((title) => {
					this.addList(title.title)
				});
			}else{
				self.createNolist();
			}
		},
		createNolist: function(){
			this.map = [];
			localStorage.setItem('list', '[]');
			this.list.innerHTML = "<li class='not-task'><p>"+this.noList+"</p></li>";
			this.list.classList.add('notask')
		},
		addTodo: function () {
			var self = this;
			self.addForm.addEventListener( 'submit', e => {
				e.preventDefault();

				if(/^ *$/.test(self.newList.value)){
					self.createmsg(self.emptyMsg);
				}else{
					var lists = JSON.parse(localStorage.getItem('list'));

					if(lists.length){
						var val = self.newList.value;
						for(var i = 0; i < lists.length; i++){
							if(lists[i].title === val){
								self.createmsg(self.existMsg);
								break;
							}
							else{
								if( (i+1) === lists.length){
									lists.push({
										title: val
									});
									localStorage.setItem('list', JSON.stringify(lists));
									self.addList(val);
									self.newList.value = '';
									break;
								}
							}
						}
					}else{
						if(self.newList.value){
							self.list.innerHTML = '';
							self.list.classList.remove('notask');

							lists.push({
								title: self.newList.value
							});
							localStorage.setItem('list', JSON.stringify(lists));
							self.addList(self.newList.value);
							self.newList.value = '';
						}
					}
				}
			});
		},
		createmsg: function(msg){
			var self = this;
			if(!document.querySelector('.message')){
				var temp = '<div class="message"><p>'+ msg +'</p></div>';
				self.msgBar.append(self.htmlToElement(temp));
				setTimeout(function () {
					document.querySelector('.message').style.opacity = '0';
				}, 1000)
				setTimeout(function () {
					document.querySelector('.message').remove();
				}, 1500)
			}
		},
		removeT: function(e){
			var self = this;
			var btn = e.path[2];
			if(btn.nodeName === 'UL'){
				btn = e.path[1];
			}
			var curname= btn.children[0].innerHTML;
			var lists = JSON.parse(localStorage.getItem('list'));
			var filteredAry = lists.filter(function(e) {
				return e.title !== curname
			});
			btn.remove();
			if(filteredAry.length === 0){
				self.createNolist()
			}
			localStorage.setItem('list', JSON.stringify(filteredAry));
		},
		addList: function (value) {
			var self = this;
			var temp = '<li><span>'+value+'</span><button class="trash">'+self.trashicon+'</button></li>';
			var obj = self.htmlToElement(temp);
			obj.children[1].addEventListener('click', evt => {
				self.removeT(evt)
			});
			self.list.prepend(obj);
		},
		htmlToElement: function(html) {
			var template = document.createElement('template');
			html = html.trim(); // Never return a text node of whitespace as the result
			template.innerHTML = html;
			return template.content.firstChild;
		},
		init: function () {
			this.checkList();
			this.addTodo();
			// this.removeTodo();
		}
	};
};