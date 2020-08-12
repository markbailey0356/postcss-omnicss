# PostCSS Omnicss

[PostCSS] plugin to create convention-based utility classes.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-omnicss'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## Cases to handle

* color-rgba(255,255,255,0.5)
* content-container
* flex-start;
* page-inner
* background-#000
* border-2px-solid-white

## Talking points

* Intro
  * Promotes an inline CSS style where you can write your templates and your styles at the same time in the same place
  * Generates convention-based utility classes based on the class strings found in your template files
  * A basic fully worded example
  * Inspired by TailwindCSS and PurgeCSS, but with some crucial differences.
  * Little to no configuration
  * Supports the full set of CSS declarations, such as shorthand properties, CSS grid, filters, transforms, etc.
  * Allows the use of the most commonly reached for CSS features, such as media queries, hover & focus selectors, child selectors.
  * Supports the use of CSS custom properties and calculations, i.e. `var()` and `calc()`
* How to turn a CSS declaration into an OmniCSS class
* Important features
  * Modifiers
    * The main benefit that OmniCSS has over using inline style attributes.
    * You can take any OmniCSS class and add modifiers to it.
    * Responsiveness
      * For example, if you only want `display-flex` to be applied on mobile screen sizes, simply add `mobile:` to it, becoming `mobile:display-flex`. Or using an abbreviation, `m:display-flex`.
      * By default, mobile screen sizes corresponds to a max screen width of 768px, but this can be configured.
      * Similarly, classes can be applied only on desktop by prepending `desktop:` (or simply `d:`) e.g. `desktop:flex-direction-column`.
    * Pseudo-selectors
      * Some CSS pseudo-selectors are also OmniCSS modifiers.
      * These should be pretty intuitive:
      * `hover:` styles the element when it is hovered by the mouse, whereas `focus:` applies when it is focused.
      * `placeholder:` styles the placeholder of an input element.
      * `before:` and `after:` styles the before or after pseudo-elements.
    * Child selectors
      * Another common scenario is when you would like to style all of the direct children of an element. Rather than creating a traditional CSS class and applying to each child, you can use the `child:` modifier.
      * For example, `child:margin-top-1rem` would generate the following CSS:

          ```css
          child\:margin-top-1rem > * {
            margin-top: 1rem
          }
          ```

      * `first-child:` (or simply `first:`) will style just the first direct child of the element, whereas `last-child:` (or simply `last:`) will only style the last child.
      * `not-first-child:` (or `not-first:` or `!first:`) will style all children but the first, this is useful for adding spacing between elements, e.g. `not-first-child:margin-bottom-1rem` (or `!first:mb-1`). Similarly, `not-last-child` (or `not-last:` or `!last:`) will style all children but the last.
    * Important values
      * `important:` or `!:` makes the property value important. e.g. `!:color-black` becomes `color: black !important`
    * Combining modifiers
      * Multiple modifiers can be used to combine their effects, e.g. `mobile:hover:color-black`.
      * Their order does sometimes matter.
        * The responsiveness modifiers can be interchanged with other modifiers. For example, `mobile:hover:` is equivalent to `hover:mobile:`.
        * But the order of pseudo-selectors and child selectors matters. For example, `child:hover:` will style all the children of a hovered element, whereas `hover:child:` will style the children when they are individually hovered.
  * CSS Variables (Custom properties)
    * Usage
      * You can both set and use the value of CSS variables in OmniCSS classes.
      * For example, `--standard-margin-10rem-5rem` becomes `--standard-margin: 10rem 5rem`
      * And `margin-var(--standard-margin)` becomes `margin: var(--standard-margin)`
      * You can define fallback values as normal.
      * It should be noted that there is no default unit for CSS variables.
    * Shorthand
      * As this syntax can be a little unweildly, we have provided a consistent shorthand for both cases using the `$` symbol.
      * The above example would become `$standard-margin-10rem-5rem` to set the variable, and `margin-$standard-margin` to use the variable.
      * You can leave out the brackets (in most cases)
      * You can define fallback values with the shorthand, but you can't leave out the brackets if you do.
    * Use cases
      * Declaring common values (colors, fonts, etc.)
        * You can declare commonly used literal values used throughout your code base.
        * Useful for colors and font families.
        * Rather than setting these inline, they can be set in your main CSS file. e.g.

          ```css
          :root {
            /* colors */
            --red: #e51937;
            --yellow: #fff600;
            --purple: #b400ff;

            /* fonts */
            --sans: "Open Sans", sans-serif;
            --mono: "Roboto Mono", monospace;

            /* transitions */
            --duration: .3s;
            --easing: cubic-bezier(.9, 0, .1, 1);

            /* transforms */
            --center: translate(-50%,-50%);

            /* filters */
            --drop-shadow: drop-shadow(0 0 20px rgba(50,7,68,.45));
          }
          ```

        * Then they can be used anywhere in your code base as follows:
          * `color-$purple`
          * `background-color-$red` (or `bg-color-$red` or even `bg-$red`)
          * `box-shadow-3px-3px-5px-$yellow`
          * `font-family-$mono`
          * `transition-transform-$duration-$easing`
          * `transform-$center-rotate(45deg)`
          * `filter-$drop-shadow-blur(5px)`
      * Setting one property based on another
        * Sometimes our properties are related to one another and it's nice to be able to express that explicitly.
        * For example, the following OmniCSS classes would make a square element with a width and height of `10rem`: `$width-10rem width-$width height-$width`
        * This declares a variable `$width` equal to `10rem` and then sets the width and height to that value.
        * The advantage of this is that we can change the width later without remembering to also change the height to match.
        * For example, we can change the width and height of the element to `5rem` by adding the following class: `m:$width-5rem`
        * With shorthands, this becomes: `$w-10rem w-$w h-$w`
        * This can be used in combination with calc() to create different aspect ratios.
        * For example, changing the previous example to a 16:9 box would be as simple as follows: `$width-10rem width-$width height-calc(9/16*$w)`
        * Or with shorthands, this becomes `$w-10rem w-$w h-(9/16*$w)`
      * Splitting transforms into seperate properties
        * Sometimes we need to be able to change only part of our transforms without changing the rest
        * This same technique can be useful for other compound properties that lack separate properties, such as filter.
        * Let's say that we have a complicated transform: `transform-rotate(45deg)-skew(30deg,25deg)-translate(40%,50%)`
        * But on mobile we need to change the x-value of translate: `m:transform-rotate(45deg)-skew(30deg,25deg)-translate(70%,50%)`
        * Rather than repeating ourselves, we can use a variable as follows:

          ```plaintext
          transform-rotate(45deg)-skew(30deg,25deg)-translate($translate-x,50%)
          $translate-x-40%
          m:$translate-x-70%
          ```

          Or using a fallback:

          ```plaintext
          transform-rotate(45deg)-skew(30deg,25deg)-translate($(translate-x,40%),50%)
          m:$translate-x-70%
          ```

* Set up and usage
  * @omnicss
  * PostCSS config
  * Laravel Mix
  * Configuration options
* Reference
  * Responsiveness and breakpoints
  * CSS Variables
  * calc()
    * calc() functions can be used in OmniCSS classes, i.e. `left-calc(50%-3rem)`
    * As a shorthand, the calc keyword can actually be omitted, simply leaving the round brackets, i.e. `left-(50%-3rem)`
    * Nested brackets in calc() function as expected: `width-((100%-2rem)/3)`
    * CSS variables can be used in conjunction with calc(): `left-(50%-$left-offset)` becomes `left: calc(50% - var(--left-offset))`
  * Shorthand properties
    * You can use any of CSS's shorthand properties, such as `margin`, `padding`, `background`, `border`, `transition`, `animation`, and even `grid`.
    * Some examples
  * Numbers and units
    * You can use any unit you like, as well as negative and floating-point numbers.
    * This means that you can use `%`, `vh`, `vw`, `vmin`, `em`, `px`, etc.
    * The leading-zero on floating point numbers is optional.
  * Default units
    * If you omit the unit for a property that requires one, we will add a default one.
    * For most properties this is `rem` but the fill list can be found below.
  * Abbreviations
    * Provides some abbreviations for common properties, e.g. instead of writing `padding-1rem`, you could write `p-1rem`, or instead of `padding-left-1rem`, you could write `pl-1rem`.
    * This can be used in combination with default units to make your classes even shorter. e.g. the default unit for `width` is `rem`, so instead of writing `width-10rem`, you could write `w-10`.
    * All abbreviations are optional. The same styles will be applied to both the abbreviated and un-abbreviated forms.
    * If OmniCSS finds multiple classes that resolve to the same CSS declaration, they will be combined into a single rule to prevent bloating the output CSS file.
  * Prefixed properties
* Technical details
  * Specificity issues
    * Most OmniCSS rules are a single class selector and have a specificity of 10
    * Therefore, order that they appear in the CSS file matters
    * More specific properties are output after less-specific ones, e.g. `border` classes will appear before `border-left`, which will appear before `border-left-color`
    * This is so you can use shorthand properties, then override them with more specific cases, e.g. `margin-1rem margin-bottom-2rem`
    * Classes with responsive modifiers are output in their media query after their non-responsive counterparts.
    * Child selectors versions of classes are output before their normal versions. This is so that you can override inherited child styles on the element directly:

      ```html
      <div class="display-flex child:flex-basis-20%">
        <div></div>
        <div class="flex-basis-40%"></div>
        <div></div>
        <div></div>
      </div>
      ```
