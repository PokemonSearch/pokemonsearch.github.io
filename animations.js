function tween(x, start, end, power = 1)
{
    return (start - end)*(freeanim(x)**power) + end;
}

function freeanim(x)
{
    return (Math.sin(-0.5*Math.PI*x) + 1)
}

class TextBox
{
    constructor(x, y, width, height)
    {
        this.selected = false;
        this.pos = {x: x, y: y};
        this.height = height;
        this.width = width;
        this.color = {r:255,g:255,b:255};
        this.target_color = {r:255,g:255,b:255};
        this.text = "";
        this.box = createElement("input","hello");
        this.box.show();
        this.box.style("border-radius", "20px").style("padding-left",(20*(height/30))+"px").style("font-family","BlackWhite").style("font-size",(21*(height/30))+"px");
        console.log(this.box.style("border-radius"))
    }
    
    render()
    {
        this.box.position(this.pos.x, this.pos.y);
        this.box.size(this.width - 20, this.height);
        this.text = this.box.value();
    }

    over()
    {
        var overX = mouseX > this.pos.x && mouseX < this.pos.x + this.width;
        var overY = mouseY > this.pos.y && mouseY < this.pos.y + this.height;
        return overX && overY;
    }
}

class Button
{
    constructor(x, y, width, height, default_color, text_color, action)
    {
        this.selected = false;
        this.action = action;
        this.pos = {x: x, y: y};
        this.height = height;
        this.width = width;
        /**@type Color */
        this.default_color = default_color;
        /**@type Color */
        this.color =  default_color;
        /**@type Color */
        this.target_color = default_color;
        /**@type Color */
        this.text_color = text_color;
        this.text = "";
    }

    render()
    {
        if(this.over())
        { 
            this.target_color = color(this.default_color.levels[0]/2,this.default_color.levels[1]/2,this.default_color.levels[2]/2)
            if(clicked)
            {
                this.action();
            }
            console.log(this.color);
        }
        else
        {
            this.target_color = this.default_color;
        }

        this.color = color(this.color.levels[0] + deltaTime*0.01*(this.target_color.levels[0] - this.color.levels[0]), this.color.levels[1] + deltaTime*0.01*(this.target_color.levels[1] - this.color.levels[1]), this.color.levels[2] + deltaTime*0.01*(this.target_color.levels[2] - this.color.levels[2]))
        

        fill(this.color);
        rect(this.pos.x, this.pos.y, this.width, this.height, 20);
        instant_text(this.text, this.height*0.7,this.pos.x + this.width/2, this.pos.y - (this.height/2)/0.6, this.text_color, true);
    }

    over()
    {
        var overX = mouseX > this.pos.x && mouseX < this.pos.x + this.width;
        var overY = mouseY > this.pos.y && mouseY < this.pos.y + this.height;
        return overX && overY;
    }
}
