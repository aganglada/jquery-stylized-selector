jquery-stylized-selector
=================

jQuery plugin manage custom select tag like real

## Getting started

This plugin allows you to manage a select tag with a custom style like a real select tag, as we are not able to style a select tag at all I came up with the idea to fix my needs.

#### How can I set it up?

Super easy!

##### 1. In your HTML you just have to write a select like it is `<select>`.

```
<select name="testing" id="testing">
  <option value="">Select one</option>
  <option value="1">nodejs</option>
  <option value="2">backbone</option>
  <option value="3">angularjs</option>
  <option value="4">emberjs</option>
  <option value="5">meteorjs</option>
</select>
```

##### 2. Then what you have to take in account is to add jquery to your file.

```
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
```

##### 3. Add a `<script>` tag with the stylized-selector library.

```
<script src="../src/jquery.stylized-selector.js"></script>
```

##### 4. Initialize your selectors.

```
<script type="text/javascript">
  $(function()
  {
     $('select').stylizedSelector({
         arrowIconClass: 'arrow'
     });
  });
</script>
```

## Options

| Name                  | Default       | Type          | Options         |
| --------------------- | ------------- | ------------- | --------------- |
| hiddenClass           | hidden        | class         | css class       |
| wrapperClass          | select        | class         | css class       |
| styledSelectorClass   | styled-select | class         | css class       |
| optionsClass          | options       | class         | css class       |
| openSelectorClass     | open          | class         | css class       |
| activeOptionClass     | selected      | class         | css class       |
| currentTextClass      | current       | class         | css class       |
| isMultipleClass       | multiple      | class         | css class       |
| arrowIconClass        | false         | mixed         | false/css class |
| onKeyDownTimeout      | 2000          | milliseconds  | number          |
| onOpen                | function(){}  | callback      | function        |
| onChange              | function(){}  | callback      | function        |

## Features

- Normal select features
- Moving through options with keyboard
- Search through options with keyboard
- Pull requests are accepted :)

Check [issues known](https://github.com/aganglada/stylized-selector/issues)!

## Result

![Stylized selector](http://oi59.tinypic.com/2hp64c1.jpg "Stylized selector")
