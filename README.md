# MineSweeper -A Javascript Project

The website can be [found here](https://fatheed7-minsweeper.netlify.app/).

## Table of Contents

-   [Objective](#objective)
-   [UX and UI](#ux-and-ui)
    -   [Site Owner Goals](#site-owner-goals)
    -   [User Stories](#user-stories)
    -   [Wireframes](#wireframes)
-   [Design](#design)
    -   [Colours](#colours)
    -   [Fonts](#fonts)
    -   [Favicon](#favicon)
-   [Features](#features)
    -   [Deployment](#deployment)
-   [Testing](#testing)
    -   [Validator Testing](#validator-testing)
    -   [Manual Testing](#validator-testing)
    -   [Bugs](#bugs)
-   [Credits](#credits)
    -   [Languages](#languages)
    -   [Frameworks, Libraries and Tools](#frameworks-libraries-and-tools)
    -   [Images](#images)

## Objective

To design an interactive version of Minesweeper with, and to demonstrate competency with, HTML, CSS & Javascript.

The was created as my second portfolio project for Code Institute's Diploma in Web Application Development.

#

## UX and UI

-   ### Site Owner Goals

    The goal of the site for the owner is to:

    1. Create a fun and interactive game of Minesweeper.
    2. Allow users to customise their experience in a number of ways, including disabling animations and remembering settings set my the customer previously.
    3. Create a simple structure on a single page, to prevent errors and encourage a user to play.

#

-   ### User Stories

    -   #### First Time Visitor Goals

        1. As a first time user, I want to immediately understand the purpose of the website.
        2. As a first time user, I want the option to be shown instructions on how the game works, but also to skip this if I'm already familiar with the game itself.
        3. As a first time user, I want to understand how to easily start a game, and for it to be obvious how to customise settings.

    -   #### Returning Visitor Goals

        1. As a returning user, I want the site to remember any settings set previously to prevent me needing to read the instructions again.
        2. As a returning user, I want the option to easily update any settings set previously.

    #

    ## Wireframes

    The wireframes for this site were created using Balasmiq, with each section and subsection noted. I endeavoured to create a single page website with the use of modals to display the rules of the game. Wireframes are available for desktop view, tablet view and, for mobile, both landscape and portrait few.
    This was added as the game is likely to be difficult to view on low resolution width devices.

    The directory containing the wireframe images can be found [here](https://github.com/Fatheed7/minesweeper/tree/main/assets/docs/wireframes).

      <details>

      <summary>Desktop Wireframe</summary>

    ![Desktop Wireframe Image](assets/docs/wireframes/desktop_wireframe.png)
      </details>

       <details>
      <summary>Tablet Wireframe</summary>

    ![Tablet Wireframe Image](assets/docs/wireframes/tablet_wireframe.png)
      </details>

       <details>
      <summary>Mobile Wireframe - Portrait</summary>

    ![Mobile Wireframe Image](assets/docs/wireframes/mobile_wireframe_portrait.png)
      </details>

      <details>
      <summary>Mobile Wireframe - Landscape</summary>

    ![Mobile Wireframe Image](assets/docs/wireframes/mobile_wireframe_landscape.png)
      </details>

#

## Design

-   ## Colours

    -   ![#ababab](https://via.placeholder.com/15/adabab/000000?text=+) `RGB(173, 171, 171)` - This colour was chosen for the Counters and Buttons section of the game, and for the cells within the game. The colour was chosen as it is consistent with colour of the cells in the original version of the game released by Microsoft. The colour was applied to the Counters & Buttons sections for consistency with the rest of the game, but also due to it's contrast against the background of the game area and the page in general.
    -   ![#696969](https://via.placeholder.com/15/696969/000000?text=+) `RGB(105, 105, 105)` - This colour was chosen as the background of the game area as it contrasts well with the other colours chosen and draws the users eye to the brighter game elements in the center of the page. The gray tone of this colour is also in keeping with the overall theme of Minesweeper.
    -   ![#d3d3d3](https://via.placeholder.com/15/d3d3d3/000000?text=+) `RGB(211, 211, 211)` - This colour was chosen as the background of the 'low screen resolution' section. This colour contrasts against the colourful background of the page well and a small gray tone was added to keep within the overall Minesweeper theme.
    -   ![#008000](https://via.placeholder.com/15/008000?text=+) `Green` - This colour was chosen for the floating buttons at the bottom of the page. The main reason for the use of this colour was due to the contrast against the background, and that it does not feature anywhere else on the site.

#

-   ## Fonts

The fonts Noto Sans & Press Start 2P were chosen from the options available from Google Fonts.

[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) was chosen as font for the main content in the help modal. This was chosen as it was not enjoyable to read large sections of text in the font Press Start 2P and this font is a lot more readable in that sense.

[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) was chosen due to retro style of the font and was primarily used for the headings of modals, the buttons and the text in the counters. As mentioned above, although the font was not enjoyable to read in large amounts, it is a lot easier in small doses.

These fonts were chosen with user accessibility and readability in mind, with a backup on sans-serif chosen for any instances where these fonts may not be available.

-   ## Favicon

The website [Favicon.io](https://favicon.io/) was used to generate the favicon image for the website. The Unicode emoji for collision, 💥, was chosen as the icon as it is relative to the theme of the game and is recognisable due to the popularity of emojis in general.

## Features

#

## Deployment

The site was created using Visual Studio Code and GitHub, and deployed to GitHub pages for testing using the below process:

    i. Navigate to the repository on GitHub.com
    ii. Select 'Settings' from the navigation bar near the top of the page.
    iii. Select 'Pages' from the sidebar on the left of the page.
    iv. Under the 'Sources' heading, select the 'Branch' dropdown menu and select the main branch.
    v. Once selected, click the 'Save' button to the right of the dropdown menu.
    vi. Deployment should be confirmed by a message on a green background - The message should have a green tick mark followed by "Your site is published at" followed by the web address.
    vii. Confirm deployment by navigating to the displayed web address.

#

## Testing

-   ## Validator Testing

#

-   ## Manual Testing

    #

    -   ## Lighthouse Testing

    #

    -   ## Wave Testing

    #

-   ## Bugs

## Credits

-   ## Languages

    -   [HTML5](https://en.wikipedia.org/wiki/HTML5)
    -   [CSS](https://en.wikipedia.org/wiki/CSS)
    -   [Javascript](https://en.wikipedia.org/wiki/JavaScript)
    -   [JQuery](https://en.wikipedia.org/wiki/JQuery)

-   ## Frameworks, Libraries and Tools

    -   [Am I Responsive](http://ami.responsivedesign.is/) - Used to verify responsiveness of website on different devices.
    -   [Balsamiq](https://balsamiq.com/) - Used to generate Wireframe images.
    -   [Bootstrap](https://getbootstrap.com/) - Main framework used for the site, with a focus on responsiveness.
    -   [Chrome Dev Tools](https://developer.chrome.com/docs/devtools/) - Used for overall development and tweaking, including testing responsiveness and performance.
    -   [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) - Used to check colour contrast to ensure usability for users with visual impairements.
    -   [Favicon.io](https://favicon.io) - Used to generate Favicon image.
    -   [Font Awesome](https://fontawesome.com/) - Used for icons on floating buttons.
    -   [GitHub](https://github.com/) - Used for version control and hosting.
    -   [Google Fonts](https://fonts.google.com/) - Used to import and alter fonts on the page.
    -   [JQuery](https://en.wikipedia.org/wiki/JQuery) - Used to simplify definition of DOM elements, but used minimally with a preference for vanilla Javascript.
    -   [LambdaTest](https://www.lambdatest.com/) - Used for Cross Site Browser Testing.
    -   [Parcel](https://www.npmjs.com/package/parcel) - Used to host website locally to aid testing before updates were commited to GitHub.
    -   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Used for consistent code formatting.
    -   [Slack](https://slack.com/) - Used for support and advice from the Code Insitute Community.
    -   [SVG Backgrounds](https://www.svgbackgrounds.com/) - Used to style the background for the site due to low file size and responsiveness.
    -   [Visual Studio Code](https://code.visualstudio.com/) - Application used for development of this site.
    -   [W3C](https://www.w3.org/) - Used for HTML & CSS Validation.
    -   [WAVE](https://wave.webaim.org/) - Used for Accessibility evaluation.

-   ## Images

    The emoji graphic used for the favicon is from the open source project [Twemoji](https://twemoji.twitter.com/). The graphics are copyright 2020 Twitter, Inc and other contributors. The graphics are licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
