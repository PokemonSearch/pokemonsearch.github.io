class Panel
{
    constructor(height)
    {
        this.height = height;
        /**@type PokeIcon */
        this.activePokemon = null;
        this.active = false;
        this.bg = loadImage("backgrounds/low_alt.png")
        this.bgscroll = 0;
        this.activeTab = 0;
        this.activeSet = 0;
        
        this.nextSetButton = new Button(0, 0, 50*0.7*w_scale, 50*0.7*w_scale, color(50, 100, 50), color(255, 255, 255), increaseSet);
        this.nextSetButton.text = ">"
        this.lastSetButton = new Button(0, 0, 50*0.7*w_scale, 50*0.7*w_scale, color(50, 100, 50), color(255, 255, 255), decreaseSet);
        this.lastSetButton.text = "<"
        
        this.activeGen = 1;

        this.nextGenButton = new Button(0, 0, 50*0.7*w_scale, 50*0.7*w_scale, color(50, 50, 100), color(255, 255, 255), increaseGen);
        this.nextGenButton.text = ">"
        this.lastGenButton = new Button(0, 0, 50*0.7*w_scale, 50*0.7*w_scale, color(50, 50, 100), color(255, 255, 255), decreaseGen);
        this.lastGenButton.text = "<"

        this.y = -this.height;
        this.stat_bars = [0, 0, 0, 0, 0, 0];
        this.displayed_form = 0;
        this.tabCount = 3;
        this.closeButton = new Button(0, 0, 100*w_scale, 35*w_scale, color(50, 50, 50), color(255, 255, 255), closePanel);
        this.closeButton.text = "Close"
        this.tabIcons = [loadImage("sprites/pokeball.png"),loadImage("sprites/specball.png"),loadImage("sprites/premball.png")]
    }

    render()
    {
        if(this.active && this.activePokemon != null && this.activePokemon.hasData)
        {
            var delta = 0.006*deltaTime*(0 - this.y);
            this.y += delta;
            targetScroll += delta;
            scrolling += delta;
            this.draw();
        }
        else if(this.y > -this.height + 0.1 && this.activePokemon != null && this.activePokemon.hasData)
        {
            var delta = 0.006*deltaTime*(-this.height - this.y);
            this.y += delta;
            targetScroll += delta;
            scrolling += delta;
            this.draw();
            if(this.y < -this.height - 10)
            {
                //this.activePokemon = null;
            }
        }
        else
        {
            this.y = -this.height;
        }
    }

    close()
    {
        this.active = false;
    }

    draw()
    {
        fill(40, 40, 80);
        rect(0, this.y, w, this.height);
        
        var imageSize = 300;

        var fontSize = 50*0.7;
        noSmooth();
        this.bgscroll += 5*deltaTime/1000;
        var bgHeight = this.height;
        var bgWidth = (this.bg.width/this.bg.height)*bgHeight;
        if(this.bgscroll > bgWidth)
        {
            this.bgscroll = 0;
        }
        tint(100,100,100,255);
        for(var i = -3; i < 4; i++)
        {
            noSmooth();
            image(this.bg,this.bgscroll + (bgWidth - 1)*i, this.y, bgWidth, bgHeight);
        }
        noSmooth();
        tint(255,255,255,255);
        var sprite = this.activePokemon.img[this.displayed_form];
        var displayName = this.activePokemon.name;
        var stats = this.activePokemon.data.stats;
        var stat_names = ["HP ","Atk","Def","SpA","SpD","Spe"];
        var types = this.activePokemon.data.types
        if(this.activeTab == 0)
        {
            if(this.displayed_form > 0)
            {
                var form = this.activePokemon.forms[this.displayed_form - 1]
                sprite = form.img;
                displayName = form.name + " " + this.activePokemon.name;
                stats = form.data.stats;
                types = form.data.types;
            }

            image(sprite, w*0.45, this.y + height*0.25 - imageSize/2, imageSize, imageSize);
            instant_text(displayName, fontSize, w*0.45 + imageSize/2, this.y + height*0.25 + imageSize/2 + fontSize, color(255), true);
            
            if(types.length == 1)
            {
                textSize(fontSize/1.7)
                instant_text(titleCase(types[0].type.name), fontSize/1.7, w*0.45 + imageSize/2, this.y + height*0.35 + imageSize/2 + fontSize, color(255), true);
            }
            else
            {
                var fullText = titleCase(types[0].type.name) + " | " + titleCase(types[1].type.name)
                var splitPos = fullText.indexOf("|")
                var subText = titleCase(types[0].type.name) + " "
                textSize(fontSize/1.7)
                instant_text(fullText, fontSize/1.7, w*0.45 + imageSize/2 + textWidth(fullText)/2 - textWidth(subText) - textWidth("|")/2, this.y + height*0.35 + imageSize/2 + fontSize, color(255), true);
            }


            for(var i = 0; i < this.stat_bars.length; i++)
            {
                this.stat_bars[i] += 0.006*deltaTime*(stats[i].base_stat - this.stat_bars[i]);
                var sp = Math.min(1, this.stat_bars[i]/150);
                var asp = Math.min(1, (this.stat_bars[i] - 130)/(200 - 130));
                asp = Math.max(0, asp);
                fill(255*(1 - sp), 255*sp, 50 + 205*asp);
                var x = w*0.15
                var y = this.y + this.height*0.25 + i*60;
                rect(x*(1920/w), y, (this.stat_bars[i]**0.9)*4*(w/1920), 40, 10);
                textSize(fontSize);
                noSmooth();
                var s1 = stat_names[i]
                var s2 = Math.round(this.stat_bars[i]).toString();
                instant_text(s1, fontSize, x - w*0.1, y - textAscent(fontSize), color(255), false);
                instant_text(s2, fontSize, x - w*0.1 + 100, y - textAscent(fontSize), color(255), false);
            }
            var abilitiesY = this.y + 100 - textAscent(fontSize);
            var abilitiesX = ((icon_x) + (w*0.45 + imageSize))/2;
            if(this.activePokemon.forms.length == 0)
            {
                var abilitiesX = (w + (w*0.45 + imageSize))/2 - textWidth("Abilities")/2;
            }
            instant_text("Abilities", fontSize, abilitiesX, abilitiesY, color(255), true);
            fill(255)
            rect(abilitiesX - textWidth("Abilities")/2, abilitiesY + 2*textAscent(fontSize) + 5, textWidth("Abilities"), 2, 20);
            var abilities = this.activePokemon.abilities;
            if(this.displayed_form > 0)
            {
                abilities = this.activePokemon.forms[this.displayed_form - 1].data.abilities
            }
            for(var i = 0; i < abilities.length; i++)
            {
                var a = abilities[i];
                var abilityName = splitTitleCase(a.ability.name);
                var col = color(255)
                if(a.is_hidden){col = color(240,230,140);}
                instant_text(abilityName, fontSize, abilitiesX, abilitiesY + (textAscent(fontSize) + this.height*0.1)*(i + 1), col, true);
            }
        }
        else if(this.activeTab == 1)
        {
            textSize(fontSize/2)
            var head_y = this.y + fontSize
            this.lastGenButton.pos.y = head_y + textAscent()/2
            this.lastGenButton.pos.x = w*0.7
            this.lastGenButton.render()
            textSize(fontSize/2)
            this.nextGenButton.pos.y = head_y + textAscent()/2
            this.nextGenButton.pos.x = w*0.7 + this.lastGenButton.width*1.1
            this.nextGenButton.render()
            var min_gen = getGen(this.activePokemon.ID)
            if(this.activeGen < min_gen)
            {
                this.activeGen = min_gen
            }
            if(this.activeGen > 9)
            {
                this.activeGen = 9
            }
            instant_text("Smogon Sets for " + displayName + " (6v6 Singles, Gen " + this.activeGen.toString() + ")", fontSize/2, w*0.5, head_y, color(255), true);
            var total_width = w
            var set_count = this.activePokemon.smogon_data.sets[this.activeGen.toString()].length
            if(set_count < 1)
            {
                textSize(fontSize)
                var null_text = "No Data"
                if(!get_smogon_data)
                {
                    null_text = "Feature is in Development!"
                } 
                instant_text(null_text, fontSize, w*0.5, this.y + this.height/2 - textAscent()/2, color(255), true);
            }
            else
            {       
                var set_text_y = this.y + fontSize*2
                textSize(fontSize/1.5)
                var head_y = this.y + fontSize
                this.lastSetButton.pos.y = set_text_y + textAscent()
                this.lastSetButton.pos.x = w*0.7
                this.lastSetButton.render()
                textSize(fontSize/1.5)
                this.nextSetButton.pos.y = set_text_y + textAscent()
                this.nextSetButton.pos.x = w*0.7 + this.lastSetButton.width*1.1
                this.nextSetButton.render()
                if(this.activeSet >= set_count)
                {
                    this.activeSet = set_count - 1
                }
                if(this.activeSet < 0)
                {
                    this.activeSet = 0;
                }
                var set = this.activePokemon.smogon_data.sets[this.activeGen.toString()][this.activeSet].data
                var tier = this.activePokemon.smogon_data.sets[this.activeGen.toString()][this.activeSet].tier
                console.log(set)
                instant_text(set.name + " ("+(this.activeSet + 1).toString()+"/"+set_count.toString()+") - " + tier, fontSize/1.5, w*0.5, set_text_y, color(255), true);
                var left_side = 0
                //EVs (Don't Exist in Gen 1)
                if(this.activeGen == 1)
                {
                    
                }
                if(this.activeGen >= 4)
                {
                    instant_text("EV Spread:", fontSize/1.5, w*0.05, (this.y + this.height*0.25 - 60) - textAscent(fontSize/1.5)/2, color(255), false);
                    if(set.evs != null)
                    {
                        var ev_bars = [set.evs.hp,set.evs.atk,set.evs.def,set.evs.spa,set.evs.spd,set.evs.spe]
                        for(var i = 0; i < ev_bars.length; i++)
                        {
                            var ev_value = ev_bars[i]
                            if(ev_value == NaN || ev_value == null)
                            {
                                ev_value = 0;
                            }
                            var sp = Math.min(1, ev_value/255);
                            fill(255*(1 - sp), 255*sp, 0);
                            var x = w*0.15
                            var y = this.y + this.height*0.25 + i*60;
                            rect(x*(1920/w), y, (ev_value + 10)*2*(w/1920), 40, 10);
                            textSize(fontSize);
                            noSmooth();
                            var s1 = stat_names[i]
                            var s2 = Math.round(ev_value).toString();
                            instant_text(s1, fontSize, x - w*0.1, y - textAscent(fontSize), color(255), false);
                            instant_text(s2, fontSize, x - w*0.1 + 100, y - textAscent(fontSize), color(255), false);
                        }
                        left_side = w*0.15*(1920/w) + 530*w/1920
                    }
                }
                if(this.activeGen >= 2)
                {
                    if(set.item != null)
                    {
                        textSize(fontSize)
                        var held_text_x = (left_side + w)/2
                        var held_text_y = set.moves.length*(this.height/8) + this.height/4 + this.y + textAscent()/2
                        var held_text = "Held Item: " + set.item
                        instant_text(held_text, fontSize/2, held_text_x, held_text_y, color(200, 200, 0), true);
                        var item_id = set.item.toLowerCase().replace(" ","-");
                        if(item_id in item_atlas)
                        {
                            var item_sprite = item_atlas[item_id];
                            noSmooth();
                            image(item_sprite, held_text_x + textWidth(held_text)/2, held_text_y + textAscent(fontSize/2)/2 + fontSize/4 + Math.sin((totalTime/(200*Math.PI)))*2.5 - 2.5, fontSize, fontSize);
                        }
                    }
                }
                if(this.activeGen >= 3)
                {
                    if(set.ability != null){instant_text("Ability: " + set.ability, fontSize/2, (left_side + w)/2, (set.moves.length+0.75)*(this.height/8) + this.height/4 + this.y + textAscent()/2, color(150, 150, 0), true);}
                }
                
                
                for(var i = 0; i < set.moves.length; i++)
                {
                    textSize(fontSize)
                    instant_text(set.moves[i], fontSize, (left_side + w)/2, i*(this.height/8) + this.height/4 + this.y, color(255), true);
                }
                
            }
        }
        else if(this.activeTab == 2)
        {
            if(this.activePokemon.loaded_misc == false)
            {
                this.activePokemon.loadMiscData();
            }
            textSize(fontSize/2)
            var head_y = this.y + fontSize
            this.lastGenButton.pos.y = head_y + textAscent()/2
            this.lastGenButton.pos.x = w*0.7
            this.lastGenButton.render()
            textSize(fontSize/2)
            this.nextGenButton.pos.y = head_y + textAscent()/2
            this.nextGenButton.pos.x = w*0.7 + this.lastGenButton.width*1.1
            this.nextGenButton.render()
            var min_gen = getGen(this.activePokemon.ID)
            if(this.activeGen < min_gen)
            {
                this.activeGen = min_gen
            }
            if(this.activeGen > 9)
            {
                this.activeGen = 9
            }
            instant_text("Smogon Battle Stats for " + displayName + " (6v6 Singles, Gen " + this.activeGen.toString() + ")", fontSize/2, w*0.5, head_y, color(255), true);
            if(get_smogon_data && this.activePokemon.smogon_data.misc_stats != null && this.activeGen.toString() in this.activePokemon.smogon_data.misc_stats)
            {
                var data_stats = this.activePokemon.smogon_data.misc_stats[this.activeGen.toString()]
                var data_points = []
                //Item Usage
                if(Object.keys(data_stats['moves']).length > 0){data_points.push('moves');}
                if(Object.keys(data_stats['teammates']).length > 0){data_points.push('teammates');}
                if(Object.keys(data_stats['counters']).length > 0){data_points.push('counters');}
                if(this.activeGen >= 2)
                {
                    if(Object.keys(data_stats['items']).length > 0){data_points.push('items');}
                }
                if(this.activeGen >= 3)150, 14
                {
                    if(Object.keys(data_stats['abilities']).length > 0){data_points.push('abilities');}
                }
                if(this.activeGen >= 4)
                {
                    if(Object.keys(data_stats['spreads']).length > 0){data_points.push('spreads');}
                }
                for(var i = 0; i < data_points.length; i++)
                {
                    var label = data_points[i];
                    var section_width = w/data_points.length;
                    var section_height = this.height - head_y
                    
                    if(label in data_stats)
                    {
                        console.log("found " + label)
                        var data = data_stats[label]
                        textSize(fontSize/2)
                        instant_text(titleCase(label), fontSize/2, section_width*(2*i + 1)/2, head_y + textAscent(fontSize/2)*3, color(255), true);
                        var r = 0;
                        for(var point in data)
                        {
                            var bar_value = data[point]
                            if(label == 'counters')
                            {
                                bar_value = data[point][2]
                            }
                            if(bar_value < 0.1){continue;}
                            var head = point.toString() + ": "
                            
                            if(point.length >= 18)
                            {
                                textSize(fontSize/3)
                                var tx = section_width*(2*i + 1)/2 - textWidth(head)/2
                                textSize(fontSize/2)
                                var ty = head_y + (textAscent(fontSize/2)*(4+r) + textAscent(fontSize/2)*(5.25+r))/2 
                                instant_text(head, fontSize/3, tx, ty, color(255), true);
                            }
                            else
                            {
                                textSize(fontSize/2)
                                instant_text(head, fontSize/2, section_width*(2*i + 1)/2 - textWidth(head)/2, head_y + textAscent(fontSize/2)*(4+r), color(255), true);
                            }
                            textSize(fontSize/2)
                            
                            var display_data = parseFloat(bar_value.toFixed(2));
                            textSize(fontSize/2)
                            var bar_x = section_width*(2*i + 1)/2
                            var bar_h = fontSize/2
                            var bar_y =  head_y + textAscent(fontSize/2)*(4+r) + bar_h*1.5
                            var bar_w = bar_value*section_width*0.9/2
                            fill(255)
                            rect(bar_x, bar_y, bar_w, bar_h, 0);
                            var data_text = Math.round(display_data*100).toString() + "%"
                            if(textWidth(data_text) < bar_w)
                            {
                                buffer_text(data_text, fontSize/3, (2*bar_x + bar_w)/2, (2*bar_y + bar_h)/2 - bar_h*1.25, color(0, 0, 0), true);
                            }
                            r++;
                        }
                    }
                }
            }
            else
            {
                textSize(fontSize)
                var fea_null_text = "No Data"
                if(!get_smogon_data)
                {
                    fea_null_text = "Feature is in Development!"
                }
                instant_text(fea_null_text, fontSize, w*0.5, this.y + this.height/2 - textAscent()/2, color(255), true);
            }
            
        }



        var factorMax = 3
        var decreaseFactor = max(factorMax, this.activePokemon.forms.length);
        var iconSize = (factorMax - 1)*100/decreaseFactor;
        var total_height = (iconSize + 10)*this.activePokemon.forms.length
        var icon_x =  w - iconSize*2*decreaseFactor/factorMax + iconSize/2
        for(var i = 0; i < this.activePokemon.forms.length; i++)
        {
            var iconForm = this.activePokemon.forms[i]
            var icon_y = this.y + height*0.25 - iconSize/2 + (iconSize + 30)*i - total_height/2
            var tabWidth = iconSize*4*decreaseFactor/factorMax
            var tabHeight = iconSize + 10
            var tabX = w - iconSize*2*decreaseFactor/factorMax
            var tabY = icon_y - 5
            
            var overX = mouseX > tabX && mouseX < tabX + tabWidth
            var overY = mouseY > tabY && mouseY < tabY + tabHeight
            var over = overX && overY
            fill(40, 40, 40)
            if(this.activeTab != 2)
            {
                rect(tabX, tabY, tabWidth, tabHeight, 10)
                noSmooth()
                if(i+1 != this.displayed_form)
                {
                    image(iconForm.img, icon_x, icon_y, iconSize, iconSize);
                    if(clicked && over)
                    {
                        this.displayed_form = i + 1
                    }
                }
                else
                {
                    image(this.activePokemon.img[0], icon_x, icon_y, iconSize, iconSize);
                    if(clicked && over)
                    {
                        this.displayed_form = 0
                    }
                }
            }
        }

        for(var i = 0; i < this.tabCount; i++)
        {
            var iconImg = this.tabIcons[i]
            var icon_y = this.y + height*0.25 - iconSize/2 + (iconSize + 30)*i - total_height/2
            var tabWidth = iconSize*decreaseFactor/factorMax
            var tabHeight = iconSize/2 + 5
            var tabX = tabWidth*(i + 1)*1.5;
            var tabY = this.y + this.height - tabHeight
            var bonusY = 0;
            if(this.activeTab == i){bonusY = tabHeight/2}
            
            var overX = mouseX > tabX && mouseX < tabX + tabWidth
            var overY = mouseY > tabY && mouseY < tabY + tabHeight
            var over = overX && overY
            fill(40, 40, 40)
            rect(tabX, tabY - bonusY, tabWidth, tabHeight + bonusY, 10, 10, 0, 0)
            noSmooth()
            var iconW = tabHeight
            var iconH = tabHeight
            image(iconImg, tabX + tabWidth/2 - iconW/2, tabY - bonusY, iconW, iconH)
            if(clicked && over)
            {
                this.activeTab = i;
            }
        }

        
        this.closeButton.pos.x = w - this.closeButton.width*1.2;
        this.closeButton.pos.y = this.y + this.height - this.closeButton.height*1.2;
        this.closeButton.render()
    }

    setActivePokemon(icon, isActive = true)
    {
        this.activePokemon = icon;
        this.active = isActive;
        this.displayed_form = 0;
        this.activeTab = 0;
    }


}
