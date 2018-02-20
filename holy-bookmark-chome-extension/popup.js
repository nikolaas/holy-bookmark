(function (api) {
    // localStorage.removeItem('authToken');

    var authSection;
    var authForm;
    var authFormError;
    var usernameField;
    var passwordField;
    var signInButton;

    var bookmarksCount;
    var updateBookmarksButton;
    var bookmarksList;

    var _bookmarks = [];

    function clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function setNodeText(node, text) {
        node.appendChild(document.createTextNode(text));
    }

    function createLink(url, title) {
        const a = document.createElement('a');
        a.href = url || '';
        a.title = title || '';
        return a;
    }

    function processBlurEvent(event) {
        setFieldTouched(event.target);
    }

    function setFieldTouched(field) {
        field.classList.add('input--touched');
    }

    function setBookmarksVisible(visible) {
        const documentsNode = document.querySelector('.bookmarks');
        if (visible) {
            documentsNode.classList.add('bookmarks--visible');
        } else {
            documentsNode.classList.remove('bookmarks--visible');
        }
    }

    function setAuthVisible(visible) {
        if (visible) {
            authSection.classList.add('auth--visible');
        } else {
            authSection.classList.remove('auth--visible');
        }
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

    function notifyBackgroundAboutAthentication() {
        chrome.runtime.sendMessage(null, {type: 'holy-bookmark-authentication-success'});
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
                setAuthVisible(false);
                setBookmarksVisible(true);
                notifyBackgroundAboutAthentication();
                fetchBookmarks();
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

    function openLink(event) {
        const link = event.target;
        chrome.tabs.create({ url: link.href });
    }

    function removeLink(bookmark, item) {
        api.deleteBookmark(bookmark)
            .then(function () {
                item.classList.add('bookmarks__bookmark--removing');
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
        item.classList.add('bookmarks__bookmark');

        const link = createLink(bookmark);
        link.classList.add('bookmarks__bookmark-link');
        link.addEventListener('click', openLink);

        const number = document.createElement('span');
        number.classList.add('bookmarks__bookmark-number');
        setNodeText(number, index + 1);
        link.appendChild(number);

        const text = document.createElement('span');
        text.classList.add('bookmarks__bookmark-text');
        setNodeText(text, bookmark);
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

        item.appendChild(link);

        return item;
    }

    function renderBookmarksList(bookmarks) {
        if (bookmarks.length === 0) {
            clearNode(bookmarksCount);
            setNodeText(bookmarksCount, 'There\'s no bookmarks yet');
            clearNode(bookmarksList);
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
            })
        }
    }

    function fetchBookmarks() {
        updateBookmarksButton.classList.add('bookmarks__update--loading');
        api.getBookmarks()
            .then(function (bookmarks) {
                _bookmarks = bookmarks;
                renderBookmarksList(bookmarks);
            })
            .finally(function () {
                updateBookmarksButton.classList.remove('bookmarks__update--loading');
            });
    }

    function init() {
        authSection = document.querySelector('.auth');
        authForm = document.querySelector('.auth__form');
        authFormError = document.querySelector('.auth__error');
        usernameField = document.querySelector('.auth__username');
        passwordField = document.querySelector('.auth__password');
        signInButton = document.querySelector('.auth__sign-in');

        usernameField.addEventListener('blur', processBlurEvent);
        passwordField.addEventListener('blur', processBlurEvent);
        signInButton.addEventListener('click', auth);

        bookmarksCount = document.querySelector('.bookmarks__count');
        updateBookmarksButton = document.querySelector('.bookmarks__update');
        bookmarksList = document.querySelector('.bookmarks__list');

        updateBookmarksButton.addEventListener('click', fetchBookmarks);

        if (api.isAuthenticated()) {
            setBookmarksVisible(true);
            fetchBookmarks();
        } else {
            setAuthVisible(true);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})(holyBookmarkApi);
