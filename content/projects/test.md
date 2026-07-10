---
name: NAHtion
fields: [dev]
image: ../attachments/underconstruction.gif
link: "https://developers.notion.com/"
published: false
indev: true
subtitle: A notion test page for notion block parsing
---

In this paragraph, there should be a <a href=partials>link to another page</a> which I have no idea how it shall work.

a second paragraph lies here

Part of this paragraph should be yellow

a third!

HELLOOOOOOO!

<aside>
👌 This is a callout!

</aside>

```jsx
export async function getDbWithPages(queryObject) {
	return (await getDb(queryObject)).map(getPage)
}

function getProperties (row) {
	return { id: row.id, ...objectMap(row.properties, parseProperty) }
}

async function getPage (row) {
	return { ...row, page: parsePage(await notion.blocks.children.list({ block_id: row.id })) }
}

function parseProperty (property) {
	if (property.type in propertyTypes) return propertyTypes[property.type](property)
	else return property
}
```

# heading 1

## heading 2

### heading 3

And another paragraph with an empty one below it

![[default-cube.png]]

This is an image caption

- [x]  Todo 1
- [ ]  todo 2
- bullet 1
- bullet 2
1. numbered 1
2. numbered 2
