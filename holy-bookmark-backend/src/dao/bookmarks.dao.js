import uuid from "uuid/v4";
import { findIndex, propEq } from "ramda";
import { createSorter } from "../utils/sort.utils";
import { createFilter } from "../utils/filter.utils";
import { getPropertyType } from "../utils/object.utils";
import { Bookmark } from "../models/bookmark";

const bookmarks = [];

function getBookmarks(sorting = {}, filter = {}) {
    const prop = sorting.prop || 'creationTs';
    const order = sorting.order || 'asc';
    const type = getPropertyType(Bookmark, prop);

    const result = [...bookmarks]
        .filter(createFilter(filter))
        .sort(createSorter(prop, type, order));

    return Promise.resolve(result);
}

function addBookmarks(newBookmarks) {
    newBookmarks.forEach(newBookmark => {
        newBookmark.id = uuid();
        bookmarks.push(newBookmark);
    });
    return Promise.resolve();
}

function deleteBookmark(bookmarkId) {
    const index = findIndex(propEq('id', bookmarkId), bookmarks);
    if (index >= 0) {
        const bookmark = bookmarks[index];
        bookmarks.splice(index, 1);
        return Promise.resolve(bookmark);
    }
    return Promise.resolve();
}

export const BookmarkDao = {
    getBookmarks,
    addBookmarks,
    deleteBookmark,
};
