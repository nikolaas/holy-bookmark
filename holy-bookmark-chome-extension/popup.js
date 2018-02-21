(function (api) {
    // localStorage.removeItem('authToken');

    const SECTIONS = {
        AUTH: 'auth',
        LINKS: 'bookmarks',
        BOOKMARKS_TREE: 'bookmarks-tree',
    };

    const sections = [];

    function clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function setNodeText(node, text) {
        node.appendChild(document.createTextNode(text));
    }

    function section(name, node, module) {
        sections.push({ name: name, node: node, module: module || {}, active: false });
    }

    function displaySection(name, payload) {
        sections.forEach(function (section) {
            const visible = section.name === name;
            if (visible) {
                section.active = true;
                section.node.classList.add(section.name + '--visible');
                section.module.onActivate && section.module.onActivate(payload);
            } else {
                section.node.classList.remove(section.name + '--visible');
                if (section.active) {
                    section.active = false;
                    section.module.onDeactivate && section.module.onDeactivate();
                }
            }
        });
    }

    function authModule(sectionNode, onAuth) {
        const authFormError = sectionNode.querySelector('.auth__error');
        const usernameField = sectionNode.querySelector('.auth__username');
        const passwordField = sectionNode.querySelector('.auth__password');
        const signInButton = sectionNode.querySelector('.auth__sign-in');

        usernameField.addEventListener('blur', processBlurEvent);
        passwordField.addEventListener('blur', processBlurEvent);
        signInButton.addEventListener('click', auth);

        function processBlurEvent(event) {
            setFieldTouched(event.target);
        }

        function setFieldTouched(field) {
            field.classList.add('input--touched');
        }

        function setAuthDisable(disable) {
            usernameField.disabled = disable;
            passwordField.disabled = disable;
            signInButton.disabled = disable;
        }

        function setFormSubmitting(submitting) {
            if (submitting) {
                signInButton.classList.add('button--loading');
            } else {
                signInButton.classList.remove('button--loading');
            }
        }

        function showFormError(validation) {
            if (!validation.form || validation.form.valid) {
                authFormError.classList.remove('auth__error--visible');
                clearNode(authFormError);
            } else {
                setNodeText(authFormError, validation.form.error);
                authFormError.classList.add('auth__error--visible');
            }
        }

        function hideFormError() {
            usernameField.classList.remove('input--error');
            usernameField.classList.remove('input--error');
            authFormError.classList.remove('auth__error--visible');
            clearNode(authFormError);
        }

        function validateField(field) {
            return {
                valid: field.validity.valid,
            };
        }

        function validateAuthForm() {
            const usernameValidation = validateField(usernameField);
            const passwordValidation = validateField(passwordField);
            return {
                valid: usernameValidation.valid && passwordValidation.valid,
                username: usernameValidation,
                password: passwordValidation,
            };
        }

        function auth(event) {
            event.preventDefault();

            setFieldTouched(usernameField);
            setFieldTouched(passwordField);

            const validation = validateAuthForm();
            if (!validation.valid) {
                showFormError(validation);
                return;
            }

            hideFormError();
            setAuthDisable(true);
            setFormSubmitting(true);

            api.login(usernameField.value, passwordField.value)
                .then(function () {
                    try {
                        onAuth();
                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch(function (error) {
                    let message;
                    if (!error.response) {
                        message = 'Service is unavailable'
                    } else if (error.response.status === 401) {
                        message = 'Invalid username or password';
                    } else {
                        message = 'Sign in failed. Try later';
                    }
                    console.log('auth failed:', message);
                    showFormError({ form: { valid: false, error: message } });
                })
                .finally(function () {
                    setFormSubmitting(false);
                    setAuthDisable(false);
                });
        }
    }

    function linksModule(sectionNode, onAddToBookmarks) {
        var _bookmarks = [];

        const bookmarksCount = sectionNode.querySelector('.bookmarks__count');
        const updateBookmarksButton = sectionNode.querySelector('.bookmarks__update');
        const bookmarksList = sectionNode.querySelector('.list');

        updateBookmarksButton.addEventListener('click', fetchBookmarks);

        function openLink(event) {
            const link = event.target;
            chrome.tabs.create({ url: link.href });
        }

        function removeLink(bookmark, item) {
            api.deleteBookmark(bookmark.id)
                .then(function () {
                    item.classList.add('list__item--removing');
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            item.remove();
                            resolve();
                        }, 200);
                    });
                })
                .then(fetchBookmarks);
        }

        function createBookmarkItem(bookmark, index) {
            const item = document.createElement('li');
            item.classList.add('list__item');

            const link = document.createElement('a');
            link.href = bookmark.url;
            link.classList.add('bookmarks__bookmark');
            if (!bookmark.viewed) {
                link.classList.add('bookmarks__bookmark--new');
            }
            link.addEventListener('click', openLink);

            const number = document.createElement('span');
            number.classList.add('bookmarks__bookmark-number');
            setNodeText(number, index + 1);
            link.appendChild(number);

            const text = document.createElement('span');
            text.classList.add('bookmarks__bookmark-text');
            setNodeText(text, bookmark.name || bookmark.url);
            link.appendChild(text);

            const remove = document.createElement('button');
            remove.title = 'Remove link';
            remove.classList.add('button');
            remove.classList.add('button--flat');
            remove.classList.add('bookmarks__bookmark-remove');
            remove.addEventListener('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                removeLink(bookmark, item);
            });
            link.appendChild(remove);

            const favorite = document.createElement('button');
            favorite.title = 'Add to bookmarks';
            favorite.classList.add('button');
            favorite.classList.add('button--flat');
            favorite.classList.add('bookmarks__bookmark-favorite');
            favorite.addEventListener('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                onAddToBookmarks(bookmark);
            });
            link.appendChild(favorite);

            item.appendChild(link);

            return item;
        }

        function renderBookmarksList(bookmarks) {
            if (bookmarks.length === 0) {
                clearNode(bookmarksCount);
                setNodeText(bookmarksCount, 'There\'s no bookmarks yet');
                clearNode(bookmarksList);
                bookmarksList.classList.add('bookmarks__list--empty');
            } else {
                clearNode(bookmarksCount);
                if (bookmarks.length === 1) {
                    setNodeText(bookmarksCount, 'There\'s one link');
                } else {
                    setNodeText(bookmarksCount, 'There\'s ' + bookmarks.length + ' links');
                }
                clearNode(bookmarksList);
                bookmarks.forEach(function (bookmark, index) {
                    bookmarksList.appendChild(createBookmarkItem(bookmark, index));
                });
                bookmarksList.classList.remove('bookmarks__list--empty');
            }
        }

        function fetchBookmarks() {
            updateBookmarksButton.classList.add('bookmarks__update--loading');
            api.getBookmarks()
                .then(function (bookmarks) {
                    _bookmarks = bookmarks;
                })
                .finally(function () {
                    renderBookmarksList(_bookmarks);
                    updateBookmarksButton.classList.remove('bookmarks__update--loading');
                });
        }

        return {
            onActivate: function () {
                fetchBookmarks();
            }
        };
    }
    
    function bookmarksTreeModule(sectionNode, onClose) {
        const BOOKMARKS_PANE_ID = '1';

        var _folder = null;
        var _link = null;

        const backButton = sectionNode.querySelector('.bookmarks-tree__back');
        const folderName = sectionNode.querySelector('.bookmarks-tree__folder-name');
        const folderChilds = sectionNode.querySelector('.list');

        backButton.addEventListener('click', back);

        function isFolder(node) {
            return !node.url;
        }

        function setFolder(folder) {
            _folder = folder;
        }

        function back() {
            if (_folder.id === BOOKMARKS_PANE_ID) {
                onClose();
                return;
            }

            chrome.bookmarks.get(_folder.parentId, function (nodes) {
                showFolder(nodes[0]);
            });
        }

        function showFolder(folder) {
            setFolder(folder);
            clearNode(folderName);
            setNodeText(folderName, folder.title);
            chrome.bookmarks.getChildren(folder.id, function(children){
                renderFolder(folder, children);
            });
        }

        function renderFolder(folder, children) {
            clearNode(folderChilds);

            const subFolders = children.filter(isFolder);

            if (subFolders.length === 0) {
                folderChilds.classList.add('bookmarks-tree__nodes--empty');
                setNodeText(folderChilds, 'Folder is empty');
                return;
            }

            folderChilds.classList.remove('bookmarks-tree__nodes--empty');
            subFolders.forEach(function (node) {
                const folderItem = document.createElement('li');
                folderItem.classList.add('list__item');
                folderItem.classList.add('bookmarks-tree__node');
                setNodeText(folderItem, node.title);
                folderItem.addEventListener('click', function () {
                    showFolder(node);
                });

                const selectButton = document.createElement('button');
                selectButton.classList.add('button');
                selectButton.classList.add('button--flat');
                selectButton.classList.add('bookmarks-tree__select-node');
                selectButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const bookmark = {
                        parentId: node.id,
                        url: _link.url,
                        title: _link.name
                    };
                    chrome.bookmarks.create(bookmark, function() {
                        onClose(_link);
                    });
                });
                folderItem.appendChild(selectButton);

                folderChilds.appendChild(folderItem);
            });
        }

        return {
            onActivate: function (link) {
                _link = link;
                chrome.bookmarks.get(BOOKMARKS_PANE_ID, function (nodes) {
                    showFolder(nodes[0]);
                })
            },
            onDeactivate: function () {
                _link = null;
            }
        };
    }

    function init() {
        const authSectionNode = document.querySelector('.auth');
        section(SECTIONS.AUTH, authSectionNode, authModule(authSectionNode, function onAuth() {
            // notify background about authentication success;
            chrome.runtime.sendMessage(null, {type: 'holy-bookmark-authentication-success'});
            displaySection(SECTIONS.LINKS);
        }));

        const linksSectionNode = document.querySelector('.bookmarks');
        section(SECTIONS.LINKS, linksSectionNode, linksModule(linksSectionNode, function onAddToBookmarks(link) {
            displaySection(SECTIONS.BOOKMARKS_TREE, link);
        }));

        const bookmarksTreeSectionNode = document.querySelector('.bookmarks-tree');
        section(SECTIONS.BOOKMARKS_TREE, bookmarksTreeSectionNode, bookmarksTreeModule(bookmarksTreeSectionNode, function onClose(link) {
            const process = link ? api.deleteBookmark(link.id) : Promise.resolve();
            process.finally(function () {
                displaySection(SECTIONS.LINKS);
            });
        }));

        if (api.isAuthenticated()) {
            displaySection(SECTIONS.LINKS);
        } else {
            displaySection(SECTIONS.AUTH);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})(holyBookmarkApi);
