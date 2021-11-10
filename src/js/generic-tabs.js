/**
 * Sample markup:
 *
 * <div class="js-tabs">
 *   <ul role="tablist">
 *     <li role="presentation">
 *       <a id="tab-1" class="js-tab" role="tab" aria-controls="tabpanel-1"
 *       aria-selected="true">
 *         Tab 1
 *       </a>
 *     </li>
 *     <li role="presentation">
 *       <a id="tab-2" class="js-tab" role="tab" aria-controls="tabpanel-2">
 *         Tab 2
 *       </a>
 *     </li>
 *   </ul>
 *
 *   <div id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1" >
 *     Tab Panel Content
 *   </div>
 *
 *   <div id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2" aria-hidden="true">
 *     Tab Panel Content
 *   </div>
 * </div>
 *
 */

const tabAreas = document.querySelectorAll('.js-tabs');

tabAreas.forEach((tabArea) => {
  const tabs = tabArea.querySelectorAll('.js-tabs-tab');
  const tabPanels = tabArea.querySelectorAll('.js-tabs-tabpanel');

  tabs.forEach((tab) => {
    const targetId = tab.getAttribute('aria-controls');
    const targetPanel = tabArea.querySelector('#' + targetId);

    tab.addEventListener('click', (e) => {
      e.preventDefault();

      tabs.forEach((testTab) => {
        if (testTab !== tab) {
          testTab.setAttribute('aria-selected', false);
        } else {
          testTab.setAttribute('aria-selected', true);
        }
      });

      tabPanels.forEach((testTabPanel) => {
        if (testTabPanel !== targetPanel) {
          testTabPanel.setAttribute('aria-hidden', true);
        } else {
          testTabPanel.setAttribute('aria-hidden', false);
        }
      });
    })
  });
});
