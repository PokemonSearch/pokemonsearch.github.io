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
        this.y = -this.height;
        this.stat_bars = [0, 0, 0, 0, 0, 0];
        this.displayed_form = 0;
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

        if(this.displayed_form > 0)
        {
            var form = this.activePokemon.forms[this.displayed_form - 1]
            sprite = form.img;
            displayName = form.name + " " + this.activePokemon.name;
            stats = form.data.stats;
            types = form.data.types;
        }

        image(sprite, w*0.45, this.y + height*0.25 - imageSize/2, imageSize, imageSize);
        instant_text(displayName, fontSize, w*0.45 + imageSize/2, this.y + height*0.25 + imageSize/2 + fontSize, w/2, color(255), true);
        
        if(types.length == 1)
        {
            instant_text(titleCase(types[0].type.name), fontSize, w*0.45 + imageSize/2, this.y + height*0.32 + imageSize/2 + fontSize, w/2, color(255), true);
        }
        else
        {
            instant_text(titleCase(types[0].type.name) + " / " + titleCase(types[1].type.name), fontSize, w*0.45 + imageSize/2, this.y + height*0.32 + imageSize/2 + fontSize, w/2, color(255), true);
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
            fill(130, 130, 130)
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

    setActivePokemon(icon, isActive = true)
    {
        this.activePokemon = icon;
        this.active = isActive;
        this.displayed_form = 0;
    }


}